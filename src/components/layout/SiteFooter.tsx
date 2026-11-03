import React, { useEffect, useRef, useState } from 'react';
import { BRAND } from '../../config/brand';
import { Link } from '../../lib/router';
import footerEgyptDesktop1080 from '../../assets/footer-egypt-desktop-1080.webp';
import footerEgyptDesktop1440 from '../../assets/footer-egypt-desktop-1440.webp';
import footerEgyptDesktop2172 from '../../assets/footer-egypt-desktop-2172.webp';
import footerEgyptTablet640 from '../../assets/footer-egypt-tablet-640.webp';
import footerEgyptTablet1024 from '../../assets/footer-egypt-tablet-1024.webp';
import footerEgyptTablet1536 from '../../assets/footer-egypt-tablet-1536.webp';
import footerEgyptMobile560 from '../../assets/footer-egypt-mobile-560.webp';
import footerEgyptMobile1122 from '../../assets/footer-egypt-mobile-1122.webp';
import { BrandMark } from '../brand/BrandMark';
import { PixelWordmark } from '../brand/PixelWordmark';
import {
  ArrowUpRightIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  GitHubIcon,
  NuGetIcon,
  ReleaseTagIcon,
} from '../ui/Icons';

interface FooterLink {
  label: string;
  to: string;
  external?: boolean;
}

interface FooterColumn {
  id: string;
  title: string;
  links: readonly FooterLink[];
}

const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    id: 'footer-nav-product',
    title: 'Product',
    links: [
      { label: 'Features & Comparison', to: '/features' },
      { label: 'Use Cases', to: '/use-cases' },
      { label: 'Sample Reports', to: '/examples' },
      { label: 'Integrations & MCP', to: '/integrations' },
    ],
  },
  {
    id: 'footer-nav-docs',
    title: 'Documentation',
    links: [
      { label: '60-Second Quickstart', to: '/quickstart' },
      { label: 'CLI Reference', to: '/docs/cli-reference' },
      { label: '.cqrslens.json Config', to: '/docs/configuration' },
      { label: 'Rules Catalog', to: '/rules' },
      { label: 'Exit Codes & Baselines', to: '/docs/exit-codes' },
    ],
  },
  {
    id: 'footer-nav-project',
    title: 'Project',
    links: [
      { label: 'Changelog', to: '/changelog' },
      { label: 'Roadmap', to: '/roadmap' },
      { label: 'Request a Check', to: BRAND.githubNewIssueUrl, external: true },
    ],
  },
] as const;

const SOCIAL_LINKS = [
  {
    icon: GitHubIcon,
    label: `${BRAND.name} on GitHub`,
    href: BRAND.githubUrl,
  },
  {
    icon: NuGetIcon,
    label: `${BRAND.nugetPackage} on NuGet`,
    href: BRAND.nugetUrl,
  },
  {
    icon: ReleaseTagIcon,
    label: `${BRAND.nugetPackage} releases on GitHub`,
    href: BRAND.githubReleasesUrl,
  },
] as const;

type CopyStatus = 'idle' | 'copied' | 'error';

const FOOTER_LINK_CLASS =
  'group inline-flex min-h-[44px] max-w-full items-center gap-1.5 py-1.5 font-editorial-sans text-[0.875rem] leading-[1.45] text-pretty text-[var(--color-text-footer-muted)] no-underline transition-colors duration-150 ease-[var(--ease-out)] hover:text-[var(--color-text-footer)]';

const FOOTER_SOCIAL_CLASS =
  'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[2px] border border-[var(--color-border-footer)] text-[var(--color-text-footer-muted)] no-underline transition-[border-color,background-color,color,transform] duration-150 ease-[var(--ease-out)] hover:border-[var(--color-footer-accent)] hover:bg-[var(--color-bg-footer-raised)] hover:text-[var(--color-text-footer)] active:scale-[0.96]';

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the selection-based fallback when permission is denied.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    if (!document.execCommand('copy')) {
      throw new Error('Copy command was rejected');
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

const FooterExternalArrow: React.FC = () => (
  <ArrowUpRightIcon className="size-3 shrink-0 opacity-60 transition-[transform,opacity] duration-150 ease-[var(--ease-out)] group-hover:translate-x-[1px] group-hover:-translate-y-[1px] group-hover:opacity-100" />
);

const FooterLinkItem: React.FC<{ link: FooterLink }> = ({ link }) => (
  <li>
    {link.external ? (
      <a href={link.to} target="_blank" rel="noopener noreferrer" className={FOOTER_LINK_CLASS}>
        <span>{link.label}</span>
        <FooterExternalArrow />
      </a>
    ) : (
      <Link to={link.to} className={FOOTER_LINK_CLASS}>
        <span>{link.label}</span>
      </Link>
    )}
  </li>
);

export const SiteFooter: React.FC = () => {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const timerRef = useRef<number>(0);

  useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);

  const handleCopyInstall = async () => {
    try {
      await copyText(BRAND.installCommand);
      setCopyStatus('copied');
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopyStatus('idle'), 2200);
    } catch {
      setCopyStatus('error');
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopyStatus('idle'), 4200);
    }
  };

  const handleBackToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <footer className="surface-footer relative isolate overflow-hidden border-t border-[var(--color-border-footer)] bg-[var(--color-bg-footer)] text-[var(--color-text-footer)]">
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 pt-14 pb-12 sm:grid-cols-6 sm:gap-x-8 sm:gap-y-14 sm:pt-20 xl:grid-cols-12 xl:gap-x-8 xl:gap-y-0 xl:pt-24 xl:pb-16">
          {/* Brand, origin, and social coordinates */}
          <div className="col-span-2 min-w-0 sm:col-span-6 xl:col-span-3">
            <Link
              to="/"
              aria-label={`${BRAND.name} home`}
              className="inline-flex min-h-[44px] items-center gap-3 text-[var(--color-text-footer)] no-underline transition-opacity duration-150 ease-[var(--ease-out)] hover:opacity-80"
            >
              <BrandMark className="size-7 shrink-0" />
              <PixelWordmark
                text={BRAND.name.toUpperCase()}
                className="h-[1.15rem] text-[var(--color-text-footer)]"
              />
            </Link>

            <p className="mt-4 mb-0 max-w-[30ch] font-editorial-sans text-[0.9375rem] leading-[1.6] text-pretty text-[var(--color-text-footer-muted)]">
              {BRAND.footerTagline}
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-[var(--color-footer-accent)]"
              />
              <p className="m-0 font-editorial-mono text-[0.6875rem] leading-[1.4] tracking-[0.12em] text-[var(--color-text-footer)] uppercase">
                Built in {BRAND.footerOrigin}
              </p>
            </div>
            <p className="mt-1.5 mb-0 ml-4 font-editorial-mono text-[0.625rem] leading-[1.5] tracking-[0.08em] text-[var(--color-text-footer-muted)] tabular-nums">
              {BRAND.footerCoordinates}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {SOCIAL_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    title={item.label}
                    className={FOOTER_SOCIAL_CLASS}
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product, documentation, and project wayfinding */}
          {FOOTER_COLUMNS.map((col, colIndex) => (
            <nav
              key={col.id}
              aria-labelledby={col.id}
              className={`min-w-0 ${
                colIndex === FOOTER_COLUMNS.length - 1
                  ? 'col-span-2 sm:col-span-2'
                  : 'col-span-1 sm:col-span-2'
              } xl:col-span-2`}
            >
              <h2
                id={col.id}
                className="m-0 font-editorial-mono text-[0.6875rem] font-medium leading-[1.4] tracking-[0.14em] text-[var(--color-text-footer)] uppercase"
              >
                {col.title}
              </h2>
              <div
                aria-hidden="true"
                className="mt-3 h-px w-6 bg-[var(--color-footer-accent)]"
              />
              <ul className="mt-2 mb-0 flex list-none flex-col p-0">
                {col.links.map((link) => (
                  <FooterLinkItem key={link.label} link={link} />
                ))}
              </ul>
            </nav>
          ))}

          {/* Primary conversion: copyable install command */}
          <div className="col-span-2 min-w-0 sm:col-span-6 xl:col-span-3">
            <h2 className="m-0 font-editorial-mono text-[0.6875rem] font-medium leading-[1.4] tracking-[0.14em] text-[var(--color-text-footer)] uppercase">
              Get the tool
            </h2>
            <div
              aria-hidden="true"
              className="mt-3 h-px w-6 bg-[var(--color-footer-accent)]"
            />

            <p className="mt-4 mb-0 max-w-[32ch] font-editorial-sans text-[0.875rem] leading-[1.6] text-pretty text-[var(--color-text-footer-muted)]">
              Install the global CLI, point it at any solution, and get a map without a build.
            </p>

            <button
              type="button"
              onClick={handleCopyInstall}
              aria-label={`Copy install command: ${BRAND.installCommand}`}
              className="group mt-4 flex min-h-[64px] w-full max-w-[23rem] cursor-pointer items-stretch overflow-hidden rounded-[3px] border border-[var(--color-border-footer)] bg-[var(--color-bg-footer-raised)] p-0 text-left transition-[border-color,background-color] duration-150 ease-[var(--ease-out)] hover:border-[var(--color-text-footer-muted)] active:scale-[0.99]"
            >
              <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-3.5 py-2.5">
                <span className="font-editorial-mono text-[0.625rem] leading-[1.4] tracking-[0.14em] text-[var(--color-text-footer-muted)] uppercase">
                  Install command
                </span>
                <code className="min-w-0 font-editorial-mono text-[0.71875rem] leading-[1.55] break-words text-[var(--color-text-footer)] [overflow-wrap:anywhere]">
                  <span aria-hidden="true" className="select-none opacity-60">
                    ${' '}
                  </span>
                  dotnet tool install{' '}
                  <span className="whitespace-nowrap">-g {BRAND.nugetPackage}</span>
                </code>
              </span>

              <span
                aria-hidden="true"
                className="relative flex w-12 shrink-0 items-center justify-center bg-[var(--color-footer-engraving)] text-[var(--color-bg-footer-deep)] transition-[background-color,color] duration-150 ease-[var(--ease-out)] group-hover:bg-[var(--color-footer-accent)]"
              >
                <span
                  className={`flex items-center justify-center transition-[opacity,transform,filter] duration-200 ease-[var(--ease-out)] motion-reduce:transition-none ${
                    copyStatus === 'copied'
                      ? 'scale-[0.5] opacity-0 blur-[3px]'
                      : 'scale-100 opacity-100 blur-none'
                  }`}
                >
                  <CopyIcon className="size-4" />
                </span>
                <span
                  className={`absolute inset-0 flex items-center justify-center transition-[opacity,transform,filter] duration-200 ease-[var(--ease-out)] motion-reduce:transition-none ${
                    copyStatus === 'copied'
                      ? 'scale-100 opacity-100 blur-none'
                      : 'scale-[0.5] opacity-0 blur-[3px]'
                  }`}
                >
                  <CheckIcon className="size-4" />
                </span>
              </span>
            </button>

            <p
              aria-live="polite"
              className={`mt-2 mb-0 min-h-[1.25rem] max-w-[23rem] font-editorial-mono text-[0.6875rem] leading-[1.4] transition-colors duration-150 ${
                copyStatus === 'error'
                  ? 'text-[var(--color-footer-accent)]'
                  : 'text-[var(--color-text-footer-muted)]'
              }`}
            >
              {copyStatus === 'copied'
                ? 'Copied to clipboard'
                : copyStatus === 'error'
                  ? 'Copy blocked — select the command above.'
                  : `Latest release v${BRAND.version}`}
            </p>
          </div>
        </div>

        <div className="border-t border-[var(--color-border-footer-faint)] py-5 sm:py-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p className="m-0 font-editorial-sans text-[0.75rem] leading-[1.6] text-[var(--color-text-footer-muted)]">
              © {BRAND.year} {BRAND.name}. Built by{' '}
              <a
                href={BRAND.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[32px] items-center text-[var(--color-text-footer)] no-underline underline-offset-[0.22em] transition-colors duration-150 hover:text-[var(--color-footer-accent)] hover:underline"
              >
                {BRAND.authorName}
              </a>
              .
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-0 font-editorial-mono text-[0.6875rem] leading-[1.5] text-[var(--color-text-footer-muted)]">
              <a
                href={BRAND.githubLicenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center text-[var(--color-text-footer-muted)] no-underline transition-colors duration-150 hover:text-[var(--color-text-footer)]"
              >
                MIT License
              </a>
              <span aria-hidden="true" className="h-3 w-px bg-[var(--color-border-footer)]" />
              <span>No telemetry</span>
              <span aria-hidden="true" className="h-3 w-px bg-[var(--color-border-footer)]" />
              <button
                type="button"
                onClick={handleBackToTop}
                className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-editorial-mono text-[0.6875rem] text-[var(--color-text-footer-muted)] transition-colors duration-150 hover:text-[var(--color-text-footer)]"
              >
                <span>Back to top</span>
                <ChevronDownIcon className="size-3 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-bleed Nile horizon: transparent engraved plate selected by art direction */}
      <div
        aria-hidden="true"
        className="relative mt-7 aspect-[1122/375] w-full select-none overflow-hidden sm:mt-9 md:aspect-[1536/429] xl:aspect-[2172/400]"
      >
        <picture>
          <source
            media="(min-width: 1280px)"
            type="image/webp"
            sizes="100vw"
            srcSet={`${footerEgyptDesktop1080} 1080w, ${footerEgyptDesktop1440} 1440w, ${footerEgyptDesktop2172} 2172w`}
          />
          <source
            media="(min-width: 768px)"
            type="image/webp"
            sizes="100vw"
            srcSet={`${footerEgyptTablet640} 640w, ${footerEgyptTablet1024} 1024w, ${footerEgyptTablet1536} 1536w`}
          />
          <img
            src={footerEgyptMobile1122}
            srcSet={`${footerEgyptMobile560} 560w, ${footerEgyptMobile1122} 1122w`}
            sizes="100vw"
            alt=""
            width={1122}
            height={375}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 block h-full w-full object-contain object-bottom"
          />
        </picture>
      </div>
    </footer>
  );
};
