import React, { useMemo, useState } from 'react';
import { BRAND } from '../config/brand';
import { CHANGELOG_RELEASES, ChangeCategory } from '../data/changelog';
import { PageMasthead } from '../components/layout/PageMasthead';
import { CodeBlock } from '../components/ui/CodeBlock';
import { InlineCodeText } from '../components/ui/InlineCodeText';
import { ArrowUpRightIcon } from '../components/ui/Icons';

const FILTER_CATEGORIES: readonly ('All' | ChangeCategory)[] = [
  'All',
  'Engine',
  'Rules',
  'MCP',
  'Outputs',
  'CI',
];

export const ChangelogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ChangeCategory>('All');

  const visibleReleases = useMemo(() => {
    if (selectedCategory === 'All') return CHANGELOG_RELEASES;
    return CHANGELOG_RELEASES.map((rel) => ({
      ...rel,
      changes: rel.changes.filter((c) => c.category === selectedCategory),
    })).filter((rel) => rel.changes.length > 0);
  }, [selectedCategory]);

  const getTagBadgeStyle = (tag: 'ADDED' | 'IMPROVED' | 'FIXED') => {
    switch (tag) {
      case 'ADDED':
        return 'bg-[var(--color-role-pass-bg)] text-[var(--color-role-pass-fg)]';
      case 'IMPROVED':
        return 'bg-[var(--color-role-command-bg)] text-[var(--color-role-command-fg)]';
      case 'FIXED':
        return 'bg-[var(--color-role-warn-bg)] text-[var(--color-role-warn-fg)]';
    }
  };

  return (
    <>
      <PageMasthead
        pixelLines={['CHANGELOG']}
        srTitle={`Changelog & Release History — ${BRAND.name}`}
        summary={`Chronological engineering release notes for the ${BRAND.nugetPackage} CLI, static scanners, rule catalog, and Model Context Protocol server.`}
        aside={
          <a
            href={BRAND.githubReleasesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-4 font-editorial-mono text-xs text-[var(--color-text-primary)] no-underline transition-colors duration-150 hover:bg-[var(--color-bg-subtle)]"
          >
            <span>GitHub Releases Feed</span>
            <ArrowUpRightIcon className="size-3.5" />
          </a>
        }
      />

      {/* Upgrade Bar & Category Filter */}
      <section
        aria-label="Upgrade command and release filter"
        className="border-b border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] py-5 sm:py-6"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-12 lg:gap-6">
            <div className="min-w-0 lg:col-span-7">
              <div
                role="group"
                aria-label="Filter changelog items by subsystem"
                className="flex flex-wrap gap-2"
              >
                {FILTER_CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedCategory(cat)}
                      className={`min-h-[44px] cursor-pointer rounded-[4px] border px-3.5 font-editorial-mono text-xs transition-colors duration-150 ${
                        active
                          ? 'border-[var(--color-action-solid)] bg-[var(--color-action-solid)] text-[var(--color-action-text)]'
                          : 'border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-canvas)]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="min-w-0 lg:col-span-5">
              <CodeBlock
                label={`Upgrade to v${BRAND.version}`}
                code={`dotnet tool update -g ${BRAND.nugetPackage}`}
                tone="inverse"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Release Timeline Ledger */}
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-8 md:py-20 lg:px-12">
        <div className="divide-y divide-[var(--color-border-strong)] border-t border-[var(--color-border-strong)]">
          {visibleReleases.map((release) => (
            <article
              key={release.version}
              id={`v${release.version}`}
              aria-labelledby={`rel-heading-${release.version}`}
              className="grid grid-cols-1 gap-5 py-10 sm:py-12 lg:grid-cols-12 lg:gap-12"
            >
              {/* Left Version & Milestone Column */}
              <div className="min-w-0 lg:col-span-3">
                <div className="lg:sticky lg:top-26">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-editorial-mono text-xl font-medium tabular-data text-[var(--color-text-primary)]">
                      v{release.version}
                    </span>
                    {release.isLatest && (
                      <span className="rounded-[3px] bg-[var(--color-role-pass-bg)] px-2 py-0.5 font-editorial-mono text-[0.6875rem] font-medium text-[var(--color-role-pass-fg)]">
                        [LATEST]
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 font-editorial-mono text-xs text-[var(--color-text-muted)]">
                    {release.dateLabel}
                  </div>
                </div>
              </div>

              {/* Right Release Body */}
              <div className="min-w-0 lg:col-span-9">
                <h2
                  id={`rel-heading-${release.version}`}
                  className="m-0 max-w-[36rem] text-[clamp(1.35rem,2.3vw,1.8rem)] font-medium tracking-[-0.02em] leading-[1.2] text-balance text-[var(--color-text-primary)]"
                >
                  {release.headline}
                </h2>

                <p className="mt-3 mb-0 max-w-[42rem] font-editorial-sans text-base leading-[1.6] text-pretty text-[var(--color-text-secondary)]">
                  {release.summary}
                </p>

                <ul className="mt-6 mb-0 divide-y divide-[var(--color-border-subtle)] border-y border-[var(--color-border-subtle)] list-none p-0">
                  {release.changes.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-baseline sm:gap-3.5"
                    >
                      <div className="flex shrink-0 items-center gap-2 sm:w-44">
                        <span
                          className={`inline-block rounded-[3px] px-2 py-0.5 font-editorial-mono text-[0.6875rem] font-medium ${getTagBadgeStyle(
                            item.tag
                          )}`}
                        >
                          [{item.tag}]
                        </span>
                        <span className="font-editorial-mono text-xs text-[var(--color-text-muted)]">
                          {item.category}
                        </span>
                      </div>
                      <p className="m-0 max-w-[42rem] font-editorial-sans text-sm leading-[1.58] text-[var(--color-text-primary)]">
                        <InlineCodeText text={item.text} />
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChangelogPage;
