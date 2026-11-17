import React, { useState } from 'react';
import { BRAND } from '../config/brand';
import { CORPUS_EXAMPLES } from '../data/examples';
import { Link } from '../lib/router';
import { PageMasthead } from '../components/layout/PageMasthead';
import { CodeBlock } from '../components/ui/CodeBlock';
import { BreakablePath } from '../components/ui/InlineCodeText';
import { ArrowUpRightIcon, ChevronRightIcon } from '../components/ui/Icons';

export const ExamplesPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(CORPUS_EXAMPLES[0].id);
  const active =
    CORPUS_EXAMPLES.find((ex) => ex.id === selectedId) ?? CORPUS_EXAMPLES[0];

  const getNodeStyles = (
    role: 'presentation' | 'application' | 'infrastructure' | 'domain'
  ) => {
    switch (role) {
      case 'application':
        return {
          fill: 'var(--color-role-command-bg)',
          stroke: 'var(--color-role-command-fg)',
          text: 'var(--color-role-command-fg)',
        };
      case 'domain':
        return {
          fill: 'var(--color-role-pass-bg)',
          stroke: 'var(--color-role-pass-fg)',
          text: 'var(--color-role-pass-fg)',
        };
      case 'infrastructure':
        return {
          fill: 'var(--color-role-query-bg)',
          stroke: 'var(--color-role-query-fg)',
          text: 'var(--color-role-query-fg)',
        };
      default:
        return {
          fill: 'var(--color-bg-subtle)',
          stroke: 'var(--color-text-primary)',
          text: 'var(--color-text-primary)',
        };
    }
  };

  const handleRepoTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const nextIdx =
      e.key === 'ArrowRight'
        ? (idx + 1) % CORPUS_EXAMPLES.length
        : (idx - 1 + CORPUS_EXAMPLES.length) % CORPUS_EXAMPLES.length;
    setSelectedId(CORPUS_EXAMPLES[nextIdx].id);
    document.getElementById(`ex-tab-${CORPUS_EXAMPLES[nextIdx].id}`)?.focus();
  };

  return (
    <>
      <PageMasthead
        pixelLines={['EXAMPLES']}
        srTitle={`Sample Architecture Reports — ${BRAND.name}`}
        summary="Inspect static cartography snapshots from four widely adopted open-source .NET repositories—covering 105 projects, 154 CQRS requests, and 154 linked handlers with zero MSBuild invocations."
        aside={
          <Link to="/quickstart" className="btn-primary">
            <span>Scan Your Own Repo</span>
            <ChevronRightIcon className="size-3.5" />
          </Link>
        }
      />

      <section aria-labelledby="gallery-heading" className="py-14 sm:py-18 md:py-22">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <div className="max-w-[36rem]">
            <h2
              id="gallery-heading"
              className="m-0 text-[clamp(1.6rem,2.8vw,2.25rem)] font-medium tracking-[-0.025em] leading-[1.18] text-balance text-[var(--color-text-primary)]"
            >
              Select a public .NET corpus repository.
            </h2>
            <p className="mt-2.5 mb-0 font-editorial-sans text-base leading-[1.6] text-pretty text-[var(--color-text-secondary)]">
              Validation snapshot recorded on 7 November 2026 (v1.0.0; shape and check counts
              unchanged in v1.1.0). Upstream HEADs move, so rerun the CLI against any repository to
              reproduce or update these counts.
            </p>
          </div>

          {/* Repository Selector Tabs (2x2 Grid on Mobile/Tablet, Single Row on lg+) */}
          <div
            role="tablist"
            aria-label="Open-source .NET benchmark repositories"
            className="mt-8 grid grid-cols-2 border-t border-l border-[var(--color-border-strong)] sm:mt-9 lg:flex lg:flex-nowrap lg:border-t-0 lg:border-b lg:border-l-0"
          >
            {CORPUS_EXAMPLES.map((ex, idx) => {
              const selected = ex.id === active.id;
              return (
                <button
                  key={ex.id}
                  id={`ex-tab-${ex.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`ex-panel-${ex.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setSelectedId(ex.id)}
                  onKeyDown={(e) => handleRepoTabKeyDown(e, idx)}
                  className={`flex min-h-[52px] min-w-0 cursor-pointer flex-col items-start justify-center border-r border-b px-3 py-2 text-left font-editorial-mono text-xs transition-colors duration-150 lg:min-h-[48px] lg:shrink-0 lg:flex-row lg:items-center lg:gap-0 lg:border-r-0 lg:border-b-2 lg:px-5 lg:whitespace-nowrap ${
                    selected
                      ? 'border-r-[var(--color-border-strong)] border-b-[var(--color-text-primary)] bg-[var(--color-bg-elevated)] font-medium text-[var(--color-text-primary)] lg:bg-transparent'
                      : 'border-r-[var(--color-border-strong)] border-b-[var(--color-border-strong)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] lg:border-b-transparent'
                  }`}
                >
                  <span className="truncate text-[0.6875rem] opacity-75 lg:text-xs lg:opacity-100">
                    {ex.owner}
                  </span>
                  <span className="w-full truncate font-medium lg:w-auto">{ex.repo}</span>
                </button>
              );
            })}
          </div>

          {/* Active Corpus Report Blueprint */}
          <div
            id={`ex-panel-${active.id}`}
            role="tabpanel"
            aria-labelledby={`ex-tab-${active.id}`}
            className="border-x border-b border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)]"
          >
            {/* Header Summary Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)] px-4 py-4 sm:gap-4 sm:px-7">
              <div className="min-w-0">
                <div className="font-editorial-sans text-base font-medium text-[var(--color-text-primary)]">
                  {active.architectureStyle}
                </div>
                <div className="mt-0.5 font-editorial-mono text-xs text-[var(--color-text-secondary)]">
                  {active.mediatorStack} · {active.reportNote}
                </div>
              </div>

              <a
                href={active.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-3.5 font-editorial-mono text-xs text-[var(--color-text-primary)] no-underline transition-colors duration-150 hover:bg-[var(--color-bg-canvas)]"
              >
                <span>Upstream Repo</span>
                <ArrowUpRightIcon className="size-3.5" />
              </a>
            </div>

            {/* Tabular Metric Bar */}
            <dl className="m-0 grid grid-cols-3 border-b border-[var(--color-border-subtle)] tabular-data sm:grid-cols-6">
              {[
                { label: 'Projects', val: String(active.projects) },
                { label: 'Requests', val: String(active.requests) },
                { label: 'Handlers', val: String(active.handlers) },
                { label: 'Validators', val: String(active.validators) },
                { label: 'Behaviors', val: String(active.behaviors) },
                { label: 'DbContexts', val: String(active.dbContexts) },
              ].map((stat, sIdx) => (
                <div
                  key={stat.label}
                  className={`border-[var(--color-border-subtle)] px-3.5 py-3 sm:px-5 sm:py-3.5 ${
                    sIdx % 3 !== 0 ? 'border-l ' : ''
                  }${sIdx >= 3 ? 'border-t sm:border-t-0 ' : ''}${
                    sIdx === 3 ? 'sm:border-l ' : ''
                  }`}
                >
                  <dt className="font-editorial-sans text-xs text-[var(--color-text-muted)]">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 mb-0 font-editorial-mono text-base font-medium text-[var(--color-text-primary)]">
                    {stat.val}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Split Topology SVG + Representative Vertical Slice */}
            <div className="grid grid-cols-1 border-b border-[var(--color-border-subtle)] lg:grid-cols-12">
              <div className="min-w-0 border-b border-[var(--color-border-subtle)] p-4 sm:p-7 lg:col-span-6 lg:border-r lg:border-b-0">
                <div className="font-editorial-mono text-xs text-[var(--color-text-muted)]">
                  Representative Layer Topology (rendered from scan graph data)
                </div>

                {/* Compact Mobile Layer Stack (< 640px) — avoids SVG scaling/clipping */}
                <div className="mt-4 space-y-2 sm:hidden">
                  {active.nodes.map((node) => {
                    const st = getNodeStyles(node.role);
                    return (
                      <div
                        key={node.id}
                        style={{
                          backgroundColor: st.fill,
                          borderColor: st.stroke,
                          color: st.text,
                        }}
                        className="flex items-center justify-between gap-2 border px-3 py-2 font-editorial-mono text-xs font-medium"
                      >
                        <span className="min-w-0 break-words">{node.label}</span>
                        <span className="shrink-0 text-[0.65rem] uppercase opacity-75">
                          {node.role}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Tablet & Desktop SVG Topology (sm+) */}
                <div className="mt-4 hidden overflow-x-auto sm:block">
                  <svg
                    viewBox="0 0 560 236"
                    role="img"
                    aria-label={`Static architecture dependency diagram for ${active.owner}${active.repo}`}
                    className="block h-auto w-full min-w-0"
                  >
                    <g
                      fill="none"
                      stroke="var(--color-text-secondary)"
                      strokeWidth="1.35"
                    >
                      {active.edges.map((edge, idx) => (
                        <path
                          key={idx}
                          d={`M${edge.fromX} ${edge.fromY} L${edge.toX} ${edge.toY}`}
                        />
                      ))}
                    </g>

                    {active.nodes.map((node) => {
                      const st = getNodeStyles(node.role);
                      return (
                        <g key={node.id}>
                          <rect
                            x={node.x}
                            y={node.y}
                            width={node.w}
                            height={36}
                            fill={st.fill}
                            stroke={st.stroke}
                            strokeWidth="1.45"
                          />
                          <text
                            x={node.x + node.w / 2}
                            y={node.y + 22}
                            textAnchor="middle"
                            fill={st.text}
                            className="font-editorial-mono text-[10.5px] font-medium"
                          >
                            {node.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              <div className="min-w-0 p-4 sm:p-7 lg:col-span-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-editorial-mono text-xs text-[var(--color-text-muted)]">
                    Representative Vertical Slice (--slice)
                  </span>
                  <span className="rounded-[3px] bg-[var(--color-role-command-bg)] px-2 py-0.5 font-editorial-mono text-xs font-medium text-[var(--color-role-command-fg)]">
                    {active.featuredSlice.kind}
                  </span>
                </div>

                <div className="mt-3 break-words [overflow-wrap:anywhere] font-editorial-mono text-sm font-medium text-[var(--color-text-primary)]">
                  {active.featuredSlice.contract}
                </div>

                <dl className="mt-4 grid grid-cols-1 gap-2 text-xs sm:grid-cols-12 sm:gap-y-3">
                  <dt className="font-editorial-sans font-medium text-[var(--color-text-muted)] sm:col-span-3">
                    Dispatch
                  </dt>
                  <dd className="m-0 font-editorial-mono text-[var(--color-text-primary)] sm:col-span-9">
                    <BreakablePath path={active.featuredSlice.dispatch} />
                  </dd>

                  <dt className="mt-1.5 font-editorial-sans font-medium text-[var(--color-text-muted)] sm:col-span-3 sm:mt-0">
                    Validator
                  </dt>
                  <dd className="m-0 font-editorial-mono text-[var(--color-text-primary)] sm:col-span-9">
                    <BreakablePath path={active.featuredSlice.validator} />
                  </dd>

                  <dt className="mt-1.5 font-editorial-sans font-medium text-[var(--color-text-muted)] sm:col-span-3 sm:mt-0">
                    Pipeline
                  </dt>
                  <dd className="m-0 break-words font-editorial-mono text-[var(--color-text-secondary)] sm:col-span-9">
                    {active.featuredSlice.pipeline}
                  </dd>

                  <dt className="mt-1.5 font-editorial-sans font-medium text-[var(--color-text-muted)] sm:col-span-3 sm:mt-0">
                    Handler
                  </dt>
                  <dd className="m-0 font-editorial-mono font-medium text-[var(--color-text-primary)] sm:col-span-9">
                    <BreakablePath path={active.featuredSlice.handler} />
                  </dd>

                  <dt className="mt-1.5 font-editorial-sans font-medium text-[var(--color-text-muted)] sm:col-span-3 sm:mt-0">
                    Persistence
                  </dt>
                  <dd className="m-0 break-words font-editorial-mono text-[var(--color-text-primary)] sm:col-span-9">
                    {active.featuredSlice.persistence}
                  </dd>
                </dl>

                <div
                  className={`mt-5 rounded-[3px] px-3 py-2 font-editorial-mono text-xs ${
                    active.featuredSlice.diagnosticTone === 'pass'
                      ? 'bg-[var(--color-role-pass-bg)] text-[var(--color-role-pass-fg)]'
                      : 'bg-[var(--color-role-warn-bg)] text-[var(--color-role-warn-fg)]'
                  }`}
                >
                  {active.featuredSlice.diagnostic}
                </div>
              </div>
            </div>

            {/* Bottom Markdown Excerpt */}
            <CodeBlock
              label={`Generated Report Summary · ${active.owner}${active.repo}`}
              badge={active.findingsSummary}
              code={active.markdownExcerpt}
              tone="inverse"
              wrap
              className="border-0"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ExamplesPage;
