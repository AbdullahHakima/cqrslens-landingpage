import React, { useEffect, useRef, useState } from 'react';
import { BRAND } from '../../config/brand';
import { ROUTES } from '../../config/routes';
import { Link, useRouter } from '../../lib/router';
import { BrandMark } from '../brand/BrandMark';
import { PixelWordmark } from '../brand/PixelWordmark';
import { CloseIcon, GitHubIcon, MenuIcon, StarIcon } from '../ui/Icons';
import { formatProjectStat, useProjectStats } from '../../hooks/useProjectStats';

const HEADER_ROUTES = ROUTES.filter((r) => r.showInHeader);

export const SiteHeader: React.FC = () => {
  const { pathname } = useRouter();
  const { githubStars } = useProjectStats();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setScrolled(!(entries[0]?.isIntersecting ?? true));
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        toggleBtnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const isRouteActive = (routePath: string) => {
    if (routePath === '/docs') {
      return pathname === '/docs' || pathname.startsWith('/docs/');
    }
    return pathname === routePath;
  };

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-8 w-px"
      />
      {menuOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-[calc(var(--z-header)-1)] bg-[var(--color-bg-inverse)]/25 lg:hidden"
        />
      )}
      <header
        className={`fixed inset-x-0 top-0 z-[var(--z-header)] pt-[env(safe-area-inset-top)] transition-[background-color,border-color] duration-200 ease-[var(--ease-out)] ${
          !isHome || scrolled || menuOpen
            ? 'border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)]'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-4 sm:h-18 sm:gap-4 sm:px-8 xl:px-12">
          <Link
            to="/"
            aria-label={`${BRAND.name} home`}
            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center gap-2.5 text-[var(--color-text-primary)] no-underline transition-opacity duration-150 hover:opacity-75"
          >
            <BrandMark className="size-7 shrink-0" />
            {!isHome && (
              <PixelWordmark
                text={BRAND.name.toUpperCase()}
                className="hidden h-[0.95rem] text-[var(--color-text-primary)] sm:block lg:hidden xl:block"
              />
            )}
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-2 xl:gap-5 lg:flex">
            {HEADER_ROUTES.map((item) => {
              const active = isRouteActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={active ? 'page' : undefined}
                  className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center border-b-2 px-1.5 font-editorial-mono text-xs xl:text-[0.8125rem] whitespace-nowrap no-underline transition-colors duration-150 ${
                    active
                      ? 'border-[var(--color-text-primary)] font-medium text-[var(--color-text-primary)]'
                      : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div
              aria-hidden="true"
              className="mx-0.5 h-4 w-px bg-[var(--color-border-strong)] xl:mx-1"
            />

            <a
              href={BRAND.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                githubStars === null
                  ? `${BRAND.name} on GitHub`
                  : `${BRAND.name} on GitHub — ${formatProjectStat(githubStars)} ${
                      githubStars === 1 ? 'star' : 'stars'
                    }`
              }
              className="group inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 px-1 text-[var(--color-text-primary)] no-underline transition-opacity duration-150 hover:opacity-65"
            >
              <GitHubIcon className="size-4" />
              <span className="hidden items-center gap-0.5 font-editorial-mono text-[0.6875rem] leading-none tabular-nums text-[var(--color-text-secondary)] transition-colors duration-150 group-hover:text-[var(--color-text-primary)] xl:inline-flex">
                <StarIcon className="size-2.5" />
                {githubStars === null ? '—' : formatProjectStat(githubStars)}
              </span>
            </a>

            <Link
              to="/quickstart"
              aria-current={pathname === '/quickstart' ? 'page' : undefined}
              className="inline-flex min-h-[44px] items-center rounded-[4px] border border-[var(--color-action-solid)] bg-[var(--color-action-solid)] px-3.5 font-editorial-mono text-xs text-[var(--color-action-text)] no-underline transition-[background-color,transform] duration-150 hover:bg-[var(--color-action-solid-hover)] active:scale-[0.97]"
            >
              Quickstart
            </Link>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/quickstart"
              className="inline-flex min-h-[44px] items-center rounded-[4px] border border-[var(--color-action-solid)] bg-[var(--color-action-solid)] px-3 font-editorial-mono text-xs text-[var(--color-action-text)] no-underline"
            >
              Quickstart
            </Link>
            <button
              ref={toggleBtnRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-panel"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-bg-canvas)] text-[var(--color-text-primary)]"
            >
              {menuOpen ? <CloseIcon className="size-4" /> : <MenuIcon className="size-4" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            id="mobile-nav-panel"
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:max-h-[calc(100dvh-4.5rem)] sm:px-8 lg:hidden"
          >
            <nav aria-label="Mobile navigation" className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6">
              <Link
                to="/"
                aria-current={pathname === '/' ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
                className={`flex min-h-[48px] items-center justify-between border-b border-[var(--color-border-subtle)] font-editorial-mono text-sm no-underline ${
                  pathname === '/'
                    ? 'font-medium text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-secondary)]'
                }`}
              >
                <span>Home</span>
                {pathname === '/' && <span className="text-xs">[active]</span>}
              </Link>
              <Link
                to="/quickstart"
                aria-current={pathname === '/quickstart' ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
                className={`flex min-h-[48px] items-center justify-between border-b border-[var(--color-border-subtle)] font-editorial-mono text-sm no-underline ${
                  pathname === '/quickstart'
                    ? 'font-medium text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-secondary)]'
                }`}
              >
                <span>Quickstart</span>
                {pathname === '/quickstart' && <span className="text-xs">[active]</span>}
              </Link>
              {HEADER_ROUTES.map((item) => {
                const active = isRouteActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`flex min-h-[48px] items-center justify-between border-b border-[var(--color-border-subtle)] font-editorial-mono text-sm no-underline ${
                      active
                        ? 'font-medium text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-secondary)]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && <span className="text-xs">[active]</span>}
                  </Link>
                );
              })}
              <a
                href={BRAND.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="mt-2 flex min-h-[48px] items-center gap-2.5 font-editorial-mono text-sm text-[var(--color-text-primary)] no-underline sm:col-span-2"
              >
                <GitHubIcon className="size-4 shrink-0" />
                <span>
                  GitHub ({BRAND.nugetPackage} v{BRAND.version})
                </span>
                {githubStars !== null && (
                  <span className="ml-auto font-editorial-mono text-xs tabular-nums text-[var(--color-text-secondary)]">
                    {formatProjectStat(githubStars)} {githubStars === 1 ? 'star' : 'stars'}
                  </span>
                )}
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};
