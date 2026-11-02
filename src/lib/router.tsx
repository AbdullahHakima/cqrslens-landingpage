import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BRAND } from '../config/brand';
import { resolveRouteMeta } from '../config/routes';

interface RouterContextValue {
  pathname: string;
  hash: string;
  basePath: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  resolveHref: (to: string) => string;
  preload: (to: string) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

/**
 * Detects deployment base subpath cleanly whether hosted at root ("/")
 * or under a GitHub Pages repository subpath ("/cqrslens/").
 */
function detectBasePath(): string {
  if (typeof window === 'undefined') return '';
  const envBase = import.meta.env.BASE_URL || '/';
  if (envBase !== './' && envBase !== '/') {
    return envBase.replace(/\/+$/, '');
  }
  const path = window.location.pathname;
  if (path === '/cqrslens' || path.startsWith('/cqrslens/')) {
    return '/cqrslens';
  }
  return '';
}

function stripBase(fullPathname: string, basePath: string): string {
  let local = fullPathname;
  if (basePath && local.startsWith(basePath)) {
    local = local.slice(basePath.length);
  }
  if (!local.startsWith('/')) {
    local = '/' + local;
  }
  if (local.length > 1) {
    local = local.replace(/\/+$/, '');
  }
  return local || '/';
}

function syncDocumentMetadata(pathname: string) {
  const meta = resolveRouteMeta(pathname);
  const canonicalUrl =
    meta.canonicalPath === '/'
      ? `${BRAND.siteUrl}/`
      : `${BRAND.siteUrl}${meta.canonicalPath}`;

  document.title = meta.title;

  const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
    let el = document.head.querySelector<HTMLMetaElement>(selector);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('meta[name="description"]', 'name', 'description', meta.description);
  setMeta('meta[property="og:title"]', 'property', 'og:title', meta.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', meta.description);
  setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description);

  let canonicalEl = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', canonicalUrl);
}

export const RouterProvider: React.FC<{
  children: React.ReactNode;
  onPreloadRoute?: (pathname: string) => void;
}> = ({ children, onPreloadRoute }) => {
  const basePath = useMemo(() => detectBasePath(), []);

  const [locationState, setLocationState] = useState(() => ({
    pathname: typeof window !== 'undefined' ? stripBase(window.location.pathname, basePath) : '/',
    hash: typeof window !== 'undefined' ? window.location.hash : '',
  }));

  const scrollToHashOrTop = useCallback((hash: string, smoothHash = false) => {
    if (hash && hash.length > 1) {
      const targetId = decodeURIComponent(hash.slice(1));
      window.requestAnimationFrame(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: smoothHash ? 'smooth' : 'auto', block: 'start' });
          return;
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, []);

  useEffect(() => {
    // Support GitHub Pages 404.html query redirect (?p=/docs/cli-reference&h=#flags)
    const params = new URLSearchParams(window.location.search);
    const redirectedPath = params.get('p');
    if (redirectedPath) {
      const redirectedHash = params.get('h') || window.location.hash || '';
      const cleanPath = redirectedPath.startsWith('/') ? redirectedPath : `/${redirectedPath}`;
      const browserUrl = `${basePath}${cleanPath === '/' ? '/' : cleanPath}${redirectedHash}`;
      window.history.replaceState(null, '', browserUrl);
      const nextLocal = stripBase(window.location.pathname, basePath);
      setLocationState({ pathname: nextLocal, hash: redirectedHash });
    }
  }, [basePath]);

  useEffect(() => {
    syncDocumentMetadata(locationState.pathname);
  }, [locationState.pathname]);

  useEffect(() => {
    const onPopState = () => {
      const nextPathname = stripBase(window.location.pathname, basePath);
      const nextHash = window.location.hash;
      setLocationState({ pathname: nextPathname, hash: nextHash });
      if (nextHash) {
        scrollToHashOrTop(nextHash, false);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [basePath, scrollToHashOrTop]);

  const resolveHref = useCallback(
    (to: string): string => {
      if (to.startsWith('#')) {
        return to;
      }
      if (/^https?:\/\//i.test(to) || to.startsWith('mailto:')) {
        return to;
      }
      const [rawPath, rawHash] = to.split('#');
      const normalizedPath = !rawPath || rawPath === '/' ? '/' : rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
      const fullPath =
        normalizedPath === '/'
          ? `${basePath || ''}/`
          : `${basePath}${normalizedPath}`;
      return rawHash ? `${fullPath}#${rawHash}` : fullPath;
    },
    [basePath]
  );

  const navigate = useCallback(
    (to: string, options?: { replace?: boolean }) => {
      if (to.startsWith('#')) {
        const nextUrl = `${window.location.pathname}${to}`;
        if (options?.replace) {
          window.history.replaceState(null, '', nextUrl);
        } else {
          window.history.pushState(null, '', nextUrl);
        }
        setLocationState((prev) => ({ ...prev, hash: to }));
        scrollToHashOrTop(to, true);
        return;
      }

      const [rawPath, rawHash] = to.split('#');
      const nextPathname =
        !rawPath || rawPath === '/'
          ? '/'
          : (rawPath.startsWith('/') ? rawPath : `/${rawPath}`).replace(/\/+$/, '');
      const nextHash = rawHash ? `#${rawHash}` : '';
      const browserUrl = resolveHref(`${nextPathname}${nextHash}`);

      const samePath = nextPathname === locationState.pathname;
      if (options?.replace) {
        window.history.replaceState(null, '', browserUrl);
      } else {
        window.history.pushState(null, '', browserUrl);
      }

      setLocationState({ pathname: nextPathname, hash: nextHash });
      scrollToHashOrTop(nextHash, samePath && Boolean(nextHash));
    },
    [locationState.pathname, resolveHref, scrollToHashOrTop]
  );

  const preload = useCallback(
    (to: string) => {
      if (!onPreloadRoute || to.startsWith('#') || /^https?:\/\//i.test(to) || to.startsWith('mailto:')) {
        return;
      }
      const [rawPath] = to.split('#');
      const normalized =
        !rawPath || rawPath === '/'
          ? '/'
          : (rawPath.startsWith('/') ? rawPath : `/${rawPath}`).replace(/\/+$/, '');
      onPreloadRoute(normalized);
    },
    [onPreloadRoute]
  );

  const value = useMemo<RouterContextValue>(
    () => ({
      pathname: locationState.pathname,
      hash: locationState.hash,
      basePath,
      navigate,
      resolveHref,
      preload,
    }),
    [basePath, locationState.hash, locationState.pathname, navigate, preload, resolveHref]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

export function useRouter(): RouterContextValue {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used inside <RouterProvider>');
  }
  return ctx;
}

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({
  to,
  replace,
  onClick,
  onPointerEnter,
  onFocus,
  target,
  children,
  ...rest
}) => {
  const { navigate, resolveHref, preload } = useRouter();
  const href = resolveHref(to);
  const isExternal = /^https?:\/\//i.test(to) || to.startsWith('mailto:');

  const handlePointerEnter = (e: React.PointerEvent<HTMLAnchorElement>) => {
    onPointerEnter?.(e);
    if (!isExternal) preload(to);
  };

  const handleFocus = (e: React.FocusEvent<HTMLAnchorElement>) => {
    onFocus?.(e);
    if (!isExternal) preload(to);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      isExternal ||
      (target && target !== '_self') ||
      e.button !== 0 ||
      e.metaKey ||
      e.altKey ||
      e.ctrlKey ||
      e.shiftKey
    ) {
      return;
    }
    e.preventDefault();
    navigate(to, { replace });
  };

  return (
    <a
      href={href}
      target={target}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onFocus={handleFocus}
      {...rest}
    >
      {children}
    </a>
  );
};
