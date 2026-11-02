import React from 'react';
import { BRAND } from '../../config/brand';
import { Link } from '../../lib/router';
import { PixelWordmark } from '../brand/PixelWordmark';
import { InstallCommandButton } from '../ui/InstallCommandButton';
import { GitHubIcon, ArrowUpRightIcon, ChevronRightIcon } from '../ui/Icons';

export const InstallSection: React.FC = () => (
  <section
    id="install"
    aria-labelledby="install-heading"
    className="cv-auto border-t border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] py-14 sm:py-18 md:py-24 lg:py-28"
  >
    <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
      <div className="grid grid-cols-1 items-start gap-y-8 sm:gap-y-10 lg:grid-cols-12 lg:gap-x-12">
        <div className="min-w-0 lg:col-span-7">
          <h2 id="install-heading" className="m-0">
            <span className="sr-only">Install {BRAND.name}</span>
            <PixelWordmark
              text="INSTALL"
              glyphHeight="clamp(1.95rem, 4.5vw, 3.8rem)"
              className="text-[var(--color-text-primary)]"
            />
          </h2>

          <p className="mt-5 mb-0 max-w-[31rem] text-base leading-[1.6] text-pretty text-[var(--color-text-secondary)]">
            Ships as a global .NET 8+ tool under the{' '}
            <code className="font-editorial-mono text-[0.9em] text-[var(--color-text-primary)]">
              {BRAND.nugetPackage}
            </code>{' '}
            package. MIT licensed, zero telemetry, ready for local repositories, CI pipelines, and
            MCP coding agents.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-7 sm:gap-4">
            <InstallCommandButton />
            <Link to="/quickstart" className="btn-primary">
              <span>Interactive Quickstart</span>
              <ChevronRightIcon className="size-3.5" />
            </Link>
            <a
              href={BRAND.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-3.5 font-editorial-mono text-xs text-[var(--color-text-primary)] no-underline transition-[border-color,background-color,transform] duration-150 ease-[var(--ease-out)] hover:border-[var(--color-text-secondary)] active:scale-[0.97] sm:px-4"
            >
              <GitHubIcon className="size-3.5 shrink-0" />
              <span>View Source on GitHub</span>
              <ArrowUpRightIcon className="size-3.5 shrink-0" />
            </a>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-5">
          <div className="border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] p-4 sm:p-6">
            <div className="font-editorial-mono text-xs text-[var(--color-text-muted)]">
              First three commands
            </div>
            <pre className="mt-3 mb-0 overflow-x-auto font-editorial-mono text-[0.71875rem] leading-[1.7] text-[var(--color-text-primary)] sm:text-xs sm:leading-[1.75]">
              <code>{`# 1. Generate ARCHITECTURE.md with Mermaid diagrams
$ ${BRAND.cliBinary} .

# 2. Build a zero-JS offline interactive HTML explorer
$ ${BRAND.cliBinary} . --format html --render svg

# 3. Serve live architecture DNA to your AI coding agent
$ ${BRAND.cliBinary} . --mcp`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  </section>
);
