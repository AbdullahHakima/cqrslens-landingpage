import React, { useEffect, useRef, useState } from 'react';
import { BRAND } from '../../config/brand';
import { Link } from '../../lib/router';
import nileEtchingSrc from '../../assets/footer-nile-etching.webp';
import nileEtchingSmSrc from '../../assets/footer-nile-etching-sm.webp';
import { BrandMark } from '../brand/BrandMark';
import { PixelWordmark } from '../brand/PixelWordmark';
import {
  ArrowUpRightIcon,
  BookOpenIcon,
  CheckIcon,
  CopyIcon,
  GitHubIcon,
  IssueSignalIcon,
  NuGetIcon,
  ReleaseTagIcon,
} from '../ui/Icons';
import { ProjectStats } from '../ui/ProjectStats';

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
      { label: 'Overview', to: '/' },
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
      { label: 'CLI Reference Manual', to: '/docs/cli-reference' },
      { label: '.cqrslens.json Config', to: '/docs/configuration' },
      { label: 'Static Rules Catalog (11)', to: '/rules' },
      { label: 'Exit Codes & Baselines', to: '/docs/exit-codes' },
    ],
  },
  {
    id: 'footer-nav-project',
    title: 'Project',
    links: [
      { label: 'Changelog', to: '/changelog' },
      { label: 'Roadmap', to: '/roadmap' },
      { label: 'GitHub Repository', to: BRAND.githubUrl, external: true },
      { label: 'NuGet Package', to: BRAND.nugetUrl, external: true },
      { label: 'Request a Check', to: BRAND.githubNewIssueUrl, external: true },
    ],
  },
] as const;

const COORDINATES = [
  {
    icon: GitHubIcon,
    label: BRAND.githubDisplay,
    to: BRAND.githubUrl,
    external: true,
  },
  {
    icon: NuGetIcon,
    label: BRAND.nugetDisplay,
    to: BRAND.nugetUrl,
    external: true,
  },
  {
    icon: BookOpenIcon,
    label: 'CLI Reference & Docs',
    to: '/docs',
    external: false,
  },
  {
    icon: IssueSignalIcon,
    label: 'Roadmap & Feature Requests',
    to: '/roadmap',
    external: false,
  },
] as const;

const ICON_LINKS = [
  {
    icon: GitHubIcon,
    label: `${BRAND.name} repository on GitHub`,
    href: BRAND.githubUrl,
  },
  {
    icon: NuGetIcon,
    label: `${BRAND.nugetPackage} package on NuGet`,
    href: BRAND.nugetUrl,
  },
  {
    icon: ReleaseTagIcon,
    label: `${BRAND.nugetPackage} releases on GitHub`,
    href: BRAND.githubReleasesUrl,
  },
] as const;

export const SiteFooter: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number>(0);

  useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);

  const handleCopyInstall = async () => {
    try {
      await navigator.clipboard.writeText(BRAND.installCommand);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = BRAND.installCommand;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="surface-inverse relative overflow-hidden border-t border-[var(--color-border-strong)] bg-[var(--color-bg-inverse)] text-[var(--color-text-on-inverse)]">
      {/* Upper 12-Column Swiss Architectural Footer Grid */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 pt-14 pb-6 sm:px-8 sm:pt-18 md:pt-22 md:pb-8 lg:px-12">
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-6 sm:gap-x-8 md:gap-y-12 lg:grid-cols-12">
          {/* Column 1: Brand Lockup, Tagline, Coordinates & Package Icons */}
          <div className="col-span-2 min-w-0 sm:col-span-6 lg:col-span-3">
            <Link
              to="/"
              aria-label={`${BRAND.name} home`}
              className="inline-flex min-h-[44px] items-center gap-3 text-[var(--color-text-on-inverse)] no-underline transition-opacity duration-150 ease-[var(--ease-out)] hover:opacity-80"
            >
              <BrandMark className="size-7 shrink-0" />
              <PixelWordmark
                text={BRAND.name.toUpperCase()}
                className="h-[1.15rem] text-[var(--color-text-on-inverse)]"
              />
            </Link>

            <p className="mt-3.5 mb-0 max-w-[26ch] font-editorial-sans text-[0.9375rem] leading-[1.55] text-pretty text-[var(--color-text-on-inverse-muted)]">
              {BRAND.footerTagline}
            </p>

            <ul className="mt-5 mb-0 flex list-none flex-col p-0">
              {COORDINATES.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    {item.external ? (
                      <a
                        href={item.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] max-w-full items-center gap-2.5 font-editorial-mono text-xs text-[var(--color-text-on-inverse-muted)] no-underline transition-colors duration-150 ease-[var(--ease-out)] hover:text-[var(--color-text-on-inverse)] xl:min-h-[40px]"
                      >
                        <Icon className="size-3.5 shrink-0 text-[var(--color-text-on-inverse)]" />
                        <span className="truncate">{item.label}</span>
                      </a>
                    ) : (
                      <Link
                        to={item.to}
                        className="inline-flex min-h-[44px] max-w-full items-center gap-2.5 font-editorial-mono text-xs text-[var(--color-text-on-inverse-muted)] no-underline transition-colors duration-150 ease-[var(--ease-out)] hover:text-[var(--color-text-on-inverse)] xl:min-h-[40px]"
                      >
                        <Icon className="size-3.5 shrink-0 text-[var(--color-text-on-inverse)]" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 flex items-center gap-2.5">
              {ICON_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[4px] border border-[var(--color-border-inverse-strong)] bg-[var(--color-bg-inverse-elevated)] text-[var(--color-text-on-inverse-muted)] no-underline transition-[border-color,color,transform] duration-150 ease-[var(--ease-out)] hover:border-[var(--color-text-on-inverse)] hover:text-[var(--color-text-on-inverse)] active:scale-[0.96] xl:min-h-[40px] xl:min-w-[40px]"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Columns 2–4: Structured Architectural Wayfinding */}
          {FOOTER_COLUMNS.map((col, colIdx) => (
            <nav
              key={col.id}
              aria-labelledby={col.id}
              className={`min-w-0 sm:col-span-2 lg:col-span-2 ${
                colIdx === FOOTER_COLUMNS.length - 1 ? 'col-span-2' : 'col-span-1'
              }`}
            >
              <h3
                id={col.id}
                className="m-0 font-editorial-mono text-xs font-medium tracking-[0.06em] uppercase text-[var(--color-text-on-inverse)]"
              >
                {col.title}
              </h3>
              <div
                aria-hidden="true"
                className="mt-3 h-px w-7 bg-[var(--color-border-inverse-strong)]"
              />
              <ul className="mt-3.5 mb-0 flex list-none flex-col p-0">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex min-h-[44px] items-center gap-1.5 font-editorial-sans text-sm leading-snug text-[var(--color-text-on-inverse-muted)] no-underline transition-colors duration-150 ease-[var(--ease-out)] hover:text-[var(--color-text-on-inverse)] xl:min-h-[40px]"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRightIcon className="size-3 shrink-0 opacity-60 transition-[transform,opacity] duration-150 ease-[var(--ease-out)] group-hover:translate-x-[1px] group-hover:-translate-y-[1px] group-hover:opacity-100" />
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="inline-flex min-h-[44px] items-center gap-1.5 font-editorial-sans text-sm leading-snug text-[var(--color-text-on-inverse-muted)] no-underline transition-colors duration-150 ease-[var(--ease-out)] hover:text-[var(--color-text-on-inverse)] xl:min-h-[40px]"
                      >
                        <span>{link.label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Column 5: Quick Install & Release Watch */}
          <div className="col-span-2 min-w-0 sm:col-span-6 lg:col-span-3">
            <h3 className="m-0 font-editorial-mono text-xs font-medium tracking-[0.06em] uppercase text-[var(--color-text-on-inverse)]">
              Quick Install
            </h3>
            <div
              aria-hidden="true"
              className="mt-3 h-px w-7 bg-[var(--color-border-inverse-strong)]"
            />

            <p className="mt-4 mb-0 max-w-[32ch] font-editorial-sans text-sm leading-[1.55] text-pretty text-[var(--color-text-on-inverse-muted)]">
              Install the global .NET 8+ CLI in one command, or inspect recent releases and roadmap
              milestones.
            </p>

            {/* Compound CLI Field + High-Contrast Action Cap */}
            <button
              type="button"
              onClick={handleCopyInstall}
              aria-label={`Copy install command: ${BRAND.installCommand}`}
              className="group mt-4 flex min-h-[44px] w-full max-w-[23rem] cursor-pointer items-stretch overflow-hidden rounded-[4px] border border-[var(--color-border-inverse-strong)] bg-[var(--color-bg-inverse-elevated)] p-0 text-left transition-[border-color,transform] duration-150 ease-[var(--ease-out)] hover:border-[var(--color-text-on-inverse-muted)] active:scale-[0.98]"
            >
              <span className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 font-editorial-mono text-xs text-[var(--color-text-on-inverse)] sm:px-3.5">
                <span
                  aria-hidden="true"
                  className="select-none text-[var(--color-text-on-inverse-muted)]"
                >
                  $
                </span>
                <code className="truncate font-editorial-mono">{BRAND.installCommand}</code>
              </span>

              <span
                aria-hidden="true"
                className="relative flex w-11 shrink-0 items-center justify-center bg-[var(--color-text-on-inverse)] text-[var(--color-bg-inverse)] transition-colors duration-150 ease-[var(--ease-out)] group-hover:bg-[var(--color-action-text)]"
              >
                <span
                  className={`flex items-center justify-center transition-[opacity,transform,filter] duration-250 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none ${
                    copied
                      ? 'scale-[0.25] opacity-0 blur-[4px]'
                      : 'scale-100 opacity-100 blur-none'
                  }`}
                >
                  <CopyIcon className="size-3.5" />
                </span>
                <span
                  className={`absolute inset-0 flex items-center justify-center transition-[opacity,transform,filter] duration-250 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none ${
                    copied
                      ? 'scale-100 opacity-100 blur-none'
                      : 'scale-[0.25] opacity-0 blur-[4px]'
                  }`}
                >
                  <CheckIcon className="size-3.5" />
                </span>
              </span>
            </button>

            <div className="mt-2.5 flex max-w-[23rem] flex-wrap items-center justify-between gap-2 font-editorial-mono text-xs">
              <span aria-live="polite" className="text-[var(--color-text-on-inverse-muted)]">
                {copied ? 'Copied to clipboard' : `Latest: v${BRAND.version}`}
              </span>
              <Link
                to="/changelog"
                className="inline-flex min-h-[44px] items-center gap-1 text-[var(--color-text-on-inverse)] no-underline transition-opacity duration-150 ease-[var(--ease-out)] hover:opacity-75 xl:min-h-[38px]"
              >
                <span>View changelog</span>
              </Link>
            </div>

            <ProjectStats tone="inverse" className="mt-4" />
          </div>
        </div>
      </div>

      {/* Lower Full-Bleed Egyptian Nile Copperplate Etching Panorama + Colophon */}
      <div className="relative w-full">
        <img
          src={nileEtchingSrc}
          srcSet={`${nileEtchingSmSrc} 1086w, ${nileEtchingSrc} 2172w`}
          sizes="100vw"
          alt=""
          aria-hidden="true"
          width={2172}
          height={607}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="pointer-events-none block h-[155px] w-full select-none object-cover object-[50%_bottom] sm:h-[240px] md:h-auto md:max-h-[480px] md:object-cover md:object-bottom"
        />

        <div className="border-t border-[var(--color-border-inverse)] bg-[var(--color-bg-inverse)] pb-[env(safe-area-inset-bottom)] lg:pointer-events-none lg:absolute lg:inset-x-0 lg:bottom-2.5 lg:border-t-0 lg:bg-transparent lg:pb-0">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2.5 sm:px-8 lg:justify-end lg:px-12 lg:py-0">
            <div className="pointer-events-auto flex flex-wrap items-center gap-x-3.5 gap-y-0.5 font-editorial-sans text-[0.8125rem] text-[var(--color-text-on-inverse-muted)]">
              <span>
                Built by{' '}
                <a
                  href={BRAND.authorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center text-[var(--color-text-on-inverse)] no-underline transition-opacity duration-150 hover:underline xl:min-h-[40px]"
                >
                  {BRAND.authorName}
                </a>
              </span>

              <span aria-hidden="true" className="text-[var(--color-border-inverse-strong)]">
                |
              </span>

              <a
                href={BRAND.githubLicenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center text-[var(--color-text-on-inverse-muted)] no-underline transition-colors duration-150 hover:text-[var(--color-text-on-inverse)] xl:min-h-[40px]"
              >
                {BRAND.license} License
              </a>

              <span aria-hidden="true" className="text-[var(--color-border-inverse-strong)]">
                |
              </span>

              <a
                href={BRAND.nugetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center font-editorial-mono text-xs text-[var(--color-text-on-inverse-muted)] no-underline transition-colors duration-150 hover:text-[var(--color-text-on-inverse)] xl:min-h-[40px]"
              >
                NuGet v{BRAND.version}
              </a>

              <span aria-hidden="true" className="text-[var(--color-border-inverse-strong)]">
                |
              </span>

              <Link
                to="/changelog"
                className="inline-flex min-h-[44px] items-center text-[var(--color-text-on-inverse-muted)] no-underline transition-colors duration-150 hover:text-[var(--color-text-on-inverse)] xl:min-h-[40px]"
              >
                Changelog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
