import React, { useState } from 'react';
import { BRAND } from '../config/brand';
import { ROADMAP_ITEMS, RoadmapHorizon } from '../data/roadmap';
import { Link } from '../lib/router';
import { PageMasthead } from '../components/layout/PageMasthead';
import { InlineCodeText } from '../components/ui/InlineCodeText';
import { ArrowUpRightIcon, ChevronRightIcon } from '../components/ui/Icons';

const HORIZON_META: Record<
  RoadmapHorizon,
  { title: string; badge: string; badgeClass: string; description: string }
> = {
  shipped: {
    title: 'Shipped Foundation (v0.8.0 – v0.9.0)',
    badge: '[SHIPPED]',
    badgeClass: 'bg-[var(--color-role-pass-bg)] text-[var(--color-role-pass-fg)]',
    description:
      'Production capabilities available in the published NuGet CLI. Public corpus scans are documented snapshots, not a nightly release gate.',
  },
  next: {
    title: 'Next Horizon — Active Engineering',
    badge: '[IN DESIGN]',
    badgeClass: 'bg-[var(--color-role-command-bg)] text-[var(--color-role-command-fg)]',
    description:
      'Capabilities currently being specified and prototyped. Mirrors the project roadmap in the CqrsLens repository.',
  },
  exploring: {
    title: 'Ideas — Not Planned Yet',
    badge: '[IDEA]',
    badgeClass: 'bg-[var(--color-role-warn-bg)] text-[var(--color-role-warn-fg)]',
    description:
      'Ideas recorded in the project roadmap (ROADMAP.md) as not planned yet — no design, no schedule, no speculative calendar dates.',
  },
};

export const RoadmapPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | RoadmapHorizon>('all');

  const visibleHorizons: readonly RoadmapHorizon[] =
    filter === 'all'
      ? (['next', 'exploring', 'shipped'] as const).filter(
          (h) => ROADMAP_ITEMS.some((i) => i.horizon === h)
        )
      : [filter];

  return (
    <>
      <PageMasthead
        pixelLines={['ROADMAP']}
        srTitle={`Architectural Roadmap — ${BRAND.name}`}
        summary="Mirrors ROADMAP.md in the CqrsLens repository: what has shipped, and the ideas recorded as not planned yet. Suggest or discuss new directions directly on GitHub Issues."
        aside={
          <a
            href={BRAND.githubNewIssueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <span>Request a Rule or Feature</span>
            <ArrowUpRightIcon className="size-3.5" />
          </a>
        }
      />

      {/* Horizon Filter Bar */}
      <section
        aria-label="Filter roadmap by readiness horizon"
        className="border-b border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] py-5"
      >
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 sm:px-8 lg:px-12">
          <div
            role="group"
            aria-label="Readiness horizon"
            className="flex flex-wrap gap-2"
          >
            {(
              [
                { id: 'all', label: `All Milestones (${ROADMAP_ITEMS.length})`, count: ROADMAP_ITEMS.length },
                {
                  id: 'next',
                  label: `Next Horizon (${ROADMAP_ITEMS.filter((i) => i.horizon === 'next').length})`,
                  count: ROADMAP_ITEMS.filter((i) => i.horizon === 'next').length,
                },
                {
                  id: 'exploring',
                  label: `Exploring (${ROADMAP_ITEMS.filter((i) => i.horizon === 'exploring').length})`,
                  count: ROADMAP_ITEMS.filter((i) => i.horizon === 'exploring').length,
                },
                {
                  id: 'shipped',
                  label: `Shipped (${ROADMAP_ITEMS.filter((i) => i.horizon === 'shipped').length})`,
                  count: ROADMAP_ITEMS.filter((i) => i.horizon === 'shipped').length,
                },
              ] as const
            )
              .filter((btn) => btn.id === 'all' || btn.count > 0)
              .map((btn) => {
              const active = filter === btn.id;
              return (
                <button
                  key={btn.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(btn.id)}
                  className={`min-h-[44px] cursor-pointer rounded-[4px] border px-3.5 font-editorial-mono text-xs tabular-data transition-colors duration-150 ${
                    active
                      ? 'border-[var(--color-action-solid)] bg-[var(--color-action-solid)] text-[var(--color-action-text)]'
                      : 'border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-canvas)]'
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>

          <Link to="/changelog" className="link-quiet">
            <span>See shipped release notes</span>
            <ChevronRightIcon className="size-3.5" />
          </Link>
        </div>
      </section>

      {/* Horizon Ledgers */}
      <div className="mx-auto max-w-[1440px] divide-y divide-[var(--color-border-strong)] px-4 sm:px-8 lg:px-12">
        {visibleHorizons.map((horizonKey) => {
          const meta = HORIZON_META[horizonKey];
          const items = ROADMAP_ITEMS.filter((i) => i.horizon === horizonKey);

          return (
            <section
              key={horizonKey}
              aria-labelledby={`horizon-heading-${horizonKey}`}
              className="py-12 sm:py-14 md:py-20"
            >
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
                <div className="min-w-0 lg:col-span-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2
                      id={`horizon-heading-${horizonKey}`}
                      className="m-0 font-editorial-sans text-xl font-medium tracking-[-0.02em] text-[var(--color-text-primary)]"
                    >
                      {meta.title}
                    </h2>
                  </div>
                  <span
                    className={`mt-2.5 inline-block rounded-[3px] px-2 py-0.5 font-editorial-mono text-xs font-medium ${meta.badgeClass}`}
                  >
                    {meta.badge}
                  </span>
                  <p className="mt-3 mb-0 max-w-[28rem] font-editorial-sans text-sm leading-[1.6] text-pretty text-[var(--color-text-secondary)]">
                    {meta.description}
                  </p>
                </div>

                <div className="min-w-0 lg:col-span-8">
                  {/* Mobile Stacked Milestone Ledger (< 640px) */}
                  <div className="divide-y divide-[var(--color-border-subtle)] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] sm:hidden">
                    {items.map((item) => (
                      <div key={item.id} className="space-y-2 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-editorial-mono text-xs text-[var(--color-text-muted)]">
                            {item.area}
                          </span>
                          <span className="break-words [overflow-wrap:anywhere] rounded-[3px] bg-[var(--color-bg-subtle)] px-2 py-0.5 font-editorial-mono text-[0.6875rem] text-[var(--color-text-primary)]">
                            {item.deliverable}
                          </span>
                        </div>
                        <div className="font-editorial-sans text-[0.9375rem] font-medium text-[var(--color-text-primary)]">
                          {item.title}
                        </div>
                        <p className="m-0 font-editorial-sans text-[0.8125rem] leading-[1.58] text-[var(--color-text-secondary)]">
                          <InlineCodeText text={item.summary} />
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Tablet & Desktop 3-Column Roadmap Table (sm+) */}
                  <div className="hidden overflow-x-auto border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] sm:block">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="border-b border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] font-editorial-sans text-xs text-[var(--color-text-secondary)]">
                          <th scope="col" className="w-32 px-4 py-3 font-medium lg:w-36 lg:px-5">
                            Subsystem
                          </th>
                          <th scope="col" className="px-4 py-3 font-medium lg:px-5">
                            Capability &amp; Architectural Scope
                          </th>
                          <th scope="col" className="w-44 px-4 py-3 font-medium lg:w-52 lg:px-5">
                            Target Artifact
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border-subtle)]">
                        {items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-4 align-top font-editorial-mono text-xs text-[var(--color-text-secondary)] lg:px-5">
                              {item.area}
                            </td>
                            <td className="px-4 py-4 align-top lg:px-5">
                              <div className="font-editorial-sans text-[0.9375rem] font-medium text-[var(--color-text-primary)]">
                                {item.title}
                              </div>
                              <p className="mt-1 mb-0 max-w-[34rem] font-editorial-sans text-[0.8125rem] leading-[1.58] text-[var(--color-text-secondary)]">
                                <InlineCodeText text={item.summary} />
                              </p>
                            </td>
                            <td className="px-4 py-4 align-top font-editorial-mono text-xs text-[var(--color-text-primary)] lg:px-5">
                              {item.deliverable}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
};

export default RoadmapPage;
