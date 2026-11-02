import React from 'react';
import { BRAND } from '../config/brand';
import { DOC_CHAPTERS } from '../data/docs';
import { Link, useRouter } from '../lib/router';
import { PixelWordmark } from '../components/brand/PixelWordmark';
import { CodeBlock } from '../components/ui/CodeBlock';
import { InlineCodeText } from '../components/ui/InlineCodeText';
import { ArrowLeftIcon, ChevronDownIcon, ChevronRightIcon } from '../components/ui/Icons';

export const DocsPage: React.FC = () => {
  const { pathname, navigate } = useRouter();

  const activeSlug = pathname.startsWith('/docs/')
    ? pathname.slice('/docs/'.length)
    : DOC_CHAPTERS[0].slug;

  const activeIndex = Math.max(
    0,
    DOC_CHAPTERS.findIndex((c) => c.slug === activeSlug)
  );
  const chapter = DOC_CHAPTERS[activeIndex] ?? DOC_CHAPTERS[0];
  const prevChapter = activeIndex > 0 ? DOC_CHAPTERS[activeIndex - 1] : null;
  const nextChapter =
    activeIndex < DOC_CHAPTERS.length - 1 ? DOC_CHAPTERS[activeIndex + 1] : null;

  return (
    <div className="pt-16 sm:pt-18">
      {/* Compact Read-Mode Top Frame Bar */}
      <div className="border-b border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:gap-4 sm:px-8 sm:py-4 lg:px-12">
          <div className="flex items-center gap-3">
            <PixelWordmark
              text="DOCS"
              glyphHeight="1.15rem"
              className="text-[var(--color-text-primary)]"
            />
            <span
              aria-hidden="true"
              className="h-4 w-px bg-[var(--color-border-strong)]"
            />
            <span className="font-editorial-mono text-xs text-[var(--color-text-secondary)]">
              {BRAND.nugetPackage} CLI v{BRAND.version}
            </span>
          </div>

          {/* Mobile / Tablet Chapter Select */}
          <div className="relative w-full sm:w-auto lg:hidden">
            <label htmlFor="docs-chapter-select" className="sr-only">
              Select documentation chapter
            </label>
            <div className="relative">
              <select
                id="docs-chapter-select"
                value={chapter.slug}
                onChange={(e) => navigate(`/docs/${e.target.value}`)}
                className="min-h-[44px] w-full appearance-none rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] py-2 pr-9 pl-3.5 font-editorial-mono text-xs text-[var(--color-text-primary)] sm:min-w-[240px]"
              >
                {DOC_CHAPTERS.map((ch) => (
                  <option key={ch.slug} value={ch.slug}>
                    {ch.navTitle}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-[var(--color-text-secondary)]" />
            </div>
          </div>

          <div className="hidden items-center gap-5 lg:flex">
            <Link
              to="/rules"
              className="inline-flex min-h-[44px] items-center font-editorial-mono text-xs text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-text-primary)]"
            >
              Rules Reference (11)
            </Link>
            <Link
              to="/integrations"
              className="inline-flex min-h-[44px] items-center font-editorial-mono text-xs text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-text-primary)]"
            >
              MCP &amp; CI Setup
            </Link>
          </div>
        </div>
      </div>

      {/* Three-Column Read Shell: Left Navigation Rail · Calm Reading Column · Right Contents Rail */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-10 xl:gap-12">
          {/* Left Sticky Chapter Navigation Rail */}
          <aside
            aria-label="Documentation chapters"
            className="hidden border-r border-[var(--color-border-subtle)] py-10 pr-6 lg:col-span-3 lg:block"
          >
            <nav className="sticky top-26 flex flex-col gap-1">
              {DOC_CHAPTERS.map((ch) => {
                const isCurrent = ch.slug === chapter.slug;
                const href = ch.slug === 'overview' ? '/docs' : `/docs/${ch.slug}`;
                return (
                  <Link
                    key={ch.slug}
                    to={href}
                    aria-current={isCurrent ? 'page' : undefined}
                    className={`flex min-h-[44px] items-center rounded-[4px] px-3 font-editorial-sans text-sm no-underline transition-colors duration-150 ${
                      isCurrent
                        ? 'bg-[var(--color-bg-sunken)] font-medium text-[var(--color-text-primary)]'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    {ch.navTitle}
                  </Link>
                );
              })}

              <div className="mt-6 border-t border-[var(--color-border-subtle)] pt-5">
                <Link
                  to="/quickstart"
                  className="flex min-h-[44px] items-center justify-between rounded-[4px] px-3 font-editorial-mono text-xs text-[var(--color-text-primary)] no-underline hover:bg-[var(--color-bg-subtle)]"
                >
                  <span>60-Second Quickstart</span>
                  <ChevronRightIcon className="size-3.5" />
                </Link>
                <Link
                  to="/rules"
                  className="flex min-h-[44px] items-center justify-between rounded-[4px] px-3 font-editorial-mono text-xs text-[var(--color-text-primary)] no-underline hover:bg-[var(--color-bg-subtle)]"
                >
                  <span>Static Rules Catalog</span>
                  <ChevronRightIcon className="size-3.5" />
                </Link>
              </div>
            </nav>
          </aside>

          {/* Calm Central Reading Column */}
          <article className="min-w-0 py-8 sm:py-10 md:py-14 lg:col-span-9 xl:col-span-7">
            <div className="max-w-[43rem]">
              <h1 className="m-0 text-[clamp(1.75rem,3.1vw,2.55rem)] font-medium tracking-[-0.025em] leading-[1.15] text-balance text-[var(--color-text-primary)]">
                {chapter.title}
              </h1>

              <p className="mt-4 mb-0 font-editorial-sans text-base leading-[1.6] text-pretty text-[var(--color-text-secondary)] sm:text-[1.0625rem]">
                {chapter.lead}
              </p>

              {/* Mobile / Tablet Compact "On This Page" Disclosure (< xl) */}
              {chapter.subsections.length > 1 && (
                <details className="mt-6 border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] xl:hidden">
                  <summary className="flex min-h-[44px] cursor-pointer items-center justify-between px-4 py-2.5 font-editorial-mono text-xs font-medium text-[var(--color-text-primary)]">
                    <span>On this page ({chapter.subsections.length})</span>
                    <ChevronDownIcon className="size-3.5 text-[var(--color-text-secondary)]" />
                  </summary>
                  <ul className="m-0 divide-y divide-[var(--color-border-subtle)] border-t border-[var(--color-border-subtle)] list-none p-0">
                    {chapter.subsections.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          to={`#${sub.id}`}
                          className="flex min-h-[44px] items-center px-4 py-2 font-editorial-sans text-sm text-[var(--color-text-secondary)] no-underline hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]"
                        >
                          {sub.heading}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              )}

              <div className="mt-8 divide-y divide-[var(--color-border-subtle)] border-t border-[var(--color-border-strong)] sm:mt-10">
                {chapter.subsections.map((sub) => (
                  <section
                    key={sub.id}
                    id={sub.id}
                    aria-labelledby={`heading-${sub.id}`}
                    className="scroll-mt-24 py-8 sm:py-9"
                  >
                    <h2
                      id={`heading-${sub.id}`}
                      className="m-0 text-lg font-medium tracking-[-0.015em] text-balance text-[var(--color-text-primary)] sm:text-xl"
                    >
                      {sub.heading}
                    </h2>

                    <div className="mt-3.5 space-y-3.5">
                      {sub.paragraphs.map((para, idx) => (
                        <p
                          key={idx}
                          className="m-0 font-editorial-sans text-[0.9375rem] leading-[1.62] text-pretty text-[var(--color-text-secondary)] sm:text-base"
                        >
                          <InlineCodeText text={para} />
                        </p>
                      ))}
                    </div>

                    {sub.code && (
                      <div className="mt-6">
                        <CodeBlock label={sub.code.label} code={sub.code.snippet} tone="inverse" />
                      </div>
                    )}

                    {sub.table && (
                      <>
                        {/* Mobile Stacked Specification Rows (< 640px) */}
                        <div className="mt-6 divide-y divide-[var(--color-border-subtle)] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] tabular-data sm:hidden">
                          {sub.table.rows.map((row) => (
                            <div key={row.col1} className="space-y-2 p-3.5">
                              <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <span className="break-words [overflow-wrap:anywhere] font-editorial-mono text-xs font-medium text-[var(--color-text-primary)]">
                                  {row.col1}
                                </span>
                                <span className="rounded-[3px] bg-[var(--color-bg-subtle)] px-2 py-0.5 font-editorial-mono text-[0.6875rem] text-[var(--color-text-secondary)]">
                                  {sub.table?.headers[1]}: {row.col2}
                                </span>
                              </div>
                              <p className="m-0 font-editorial-sans text-[0.8125rem] leading-[1.52] text-[var(--color-text-secondary)]">
                                {row.col3}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Tablet & Desktop 3-Column Specification Table (sm+) */}
                        <div className="mt-6 hidden overflow-x-auto border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] sm:block">
                          <table className="w-full border-collapse text-left tabular-data">
                            <thead>
                              <tr className="border-b border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] font-editorial-sans text-xs text-[var(--color-text-secondary)]">
                                {sub.table.headers.map((h) => (
                                  <th key={h} scope="col" className="px-4 py-3 font-medium">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border-subtle)] text-[0.8125rem]">
                              {sub.table.rows.map((row) => (
                                <tr key={row.col1}>
                                  <td className="px-4 py-3 font-editorial-mono text-xs font-medium text-[var(--color-text-primary)]">
                                    {row.col1}
                                  </td>
                                  <td className="px-4 py-3 font-editorial-mono text-xs text-[var(--color-text-secondary)]">
                                    {row.col2}
                                  </td>
                                  <td className="px-4 py-3 font-editorial-sans text-[0.8125rem] leading-[1.5] text-[var(--color-text-secondary)]">
                                    {row.col3}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}

                    {sub.note && (
                      <div className="mt-5 border border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] px-4 py-3.5 font-editorial-sans text-sm leading-[1.55] text-[var(--color-text-primary)]">
                        {sub.note}
                      </div>
                    )}
                  </section>
                ))}
              </div>

              {/* Next / Previous Chapter Wayfinding */}
              <nav
                aria-label="Chapter pagination"
                className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border-strong)] pt-7 sm:gap-4 sm:pt-8"
              >
                {prevChapter ? (
                  <Link
                    to={
                      prevChapter.slug === 'overview' ? '/docs' : `/docs/${prevChapter.slug}`
                    }
                    className="inline-flex min-h-[44px] max-w-full items-center gap-2 rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-3.5 py-2 font-editorial-mono text-xs text-[var(--color-text-primary)] no-underline transition-colors duration-150 hover:bg-[var(--color-bg-subtle)] sm:px-4"
                  >
                    <ArrowLeftIcon className="size-3.5 shrink-0" />
                    <span className="truncate">{prevChapter.navTitle}</span>
                  </Link>
                ) : (
                  <span />
                )}

                {nextChapter && (
                  <Link
                    to={`/docs/${nextChapter.slug}`}
                    className="inline-flex min-h-[44px] max-w-full items-center gap-2 rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-3.5 py-2 font-editorial-mono text-xs text-[var(--color-text-primary)] no-underline transition-colors duration-150 hover:bg-[var(--color-bg-subtle)] sm:px-4"
                  >
                    <span className="truncate">{nextChapter.navTitle}</span>
                    <ChevronRightIcon className="size-3.5 shrink-0" />
                  </Link>
                )}
              </nav>
            </div>
          </article>

          {/* Right Sticky "On This Page" Rail (xl+) */}
          <aside
            aria-label="On this page"
            className="hidden py-14 xl:col-span-2 xl:block"
          >
            <div className="sticky top-26 border-l border-[var(--color-border-subtle)] pl-4">
              <div className="font-editorial-mono text-xs font-medium text-[var(--color-text-primary)]">
                On this page
              </div>
              <ul className="mt-3 mb-0 flex list-none flex-col gap-1 p-0">
                {chapter.subsections.map((sub) => (
                  <li key={sub.id}>
                    <Link
                      to={`#${sub.id}`}
                      className="inline-flex min-h-[36px] items-center font-editorial-sans text-xs leading-[1.4] text-[var(--color-text-secondary)] no-underline transition-colors duration-150 hover:text-[var(--color-text-primary)]"
                    >
                      {sub.heading}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
