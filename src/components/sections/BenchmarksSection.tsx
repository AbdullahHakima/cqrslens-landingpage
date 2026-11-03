import React from 'react';
import { Link } from '../../lib/router';
import { ArrowUpRightIcon, ChevronRightIcon } from '../ui/Icons';

const CORPUS = [
  {
    owner: 'jasontaylordev/',
    repo: 'CleanArchitecture',
    url: 'https://github.com/jasontaylordev/CleanArchitecture',
    projects: 13,
    requests: 11,
    handlers: 11,
    validators: 6,
    behaviors: 4,
    dbContexts: 1,
    findings: '0 errors / 6 warnings',
  },
  {
    owner: 'ardalis/',
    repo: 'CleanArchitecture',
    url: 'https://github.com/ardalis/CleanArchitecture',
    projects: 22,
    requests: 23,
    handlers: 23,
    validators: 21,
    behaviors: 3,
    dbContexts: 3,
    findings: '0 errors / 38 warnings',
  },
  {
    owner: 'kgrzybek/',
    repo: 'modular-monolith-with-ddd',
    url: 'https://github.com/kgrzybek/modular-monolith-with-ddd',
    projects: 47,
    requests: 105,
    handlers: 105,
    validators: 5,
    behaviors: 0,
    dbContexts: 4,
    findings: '0 errors / 205 warnings',
  },
  {
    owner: 'martinothamar/',
    repo: 'Mediator (samples)',
    url: 'https://github.com/martinothamar/Mediator',
    projects: 24,
    requests: 15,
    handlers: 15,
    validators: 1,
    behaviors: 9,
    dbContexts: 0,
    findings: '0 errors / 12 warnings',
  },
] as const;

export const BenchmarksSection: React.FC = () => (
  <section
    id="benchmarks"
    aria-labelledby="benchmarks-heading"
    className="cv-auto border-t border-[var(--color-border-subtle)] py-14 sm:py-18 md:py-24 lg:py-28"
  >
    <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
      <div className="max-w-[33rem]">
        <h2
          id="benchmarks-heading"
          className="m-0 text-[clamp(1.7rem,3.2vw,2.65rem)] font-medium tracking-[-0.025em] leading-[1.16] text-balance text-[var(--color-text-primary)]"
        >
          Measured on public .NET repositories.
        </h2>
        <p className="mt-3 mb-0 max-w-[31rem] text-base leading-[1.6] text-pretty text-[var(--color-text-secondary)]">
          A 0.9.0 snapshot taken on 2 November 2026 across 106 projects, 154 requests, and 154
          handlers in four canonical open-source solutions. All four complete with zero
          error-severity findings; the remaining warnings expose real validation, reachability, and
          notification hygiene debt.
        </p>
      </div>

      {/* Responsive Corpus Ledger: Structured Metric Blocks (< lg) + Full 8-Col Table (lg+) */}
      <div className="mt-8 border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] tabular-data sm:mt-10">
        <div className="divide-y divide-[var(--color-border-strong)] lg:hidden">
          {CORPUS.map((row) => (
            <div key={row.url}>
              <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--color-bg-subtle)] px-4 py-2.5 sm:px-5">
                <a
                  href={row.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] min-w-0 items-center gap-1.5 font-editorial-mono text-xs text-[var(--color-text-primary)] no-underline hover:underline sm:text-[0.8125rem]"
                >
                  <span className="break-words [overflow-wrap:anywhere]">
                    <span className="text-[var(--color-text-muted)]">{row.owner}</span>
                    <span className="font-medium">{row.repo}</span>
                  </span>
                  <ArrowUpRightIcon className="size-3 shrink-0 text-[var(--color-text-muted)]" />
                </a>
                <span className="rounded-[3px] bg-[var(--color-role-pass-bg)] px-2 py-0.5 font-editorial-mono text-xs font-medium text-[var(--color-role-pass-fg)]">
                  {row.findings}
                </span>
              </div>

              <dl className="m-0 grid grid-cols-3 divide-x divide-y divide-[var(--color-border-subtle)] border-t border-[var(--color-border-subtle)] sm:grid-cols-6 sm:divide-y-0">
                {[
                  { label: 'Projects', val: row.projects },
                  { label: 'Requests', val: row.requests },
                  { label: 'Handlers', val: row.handlers },
                  { label: 'Validators', val: row.validators },
                  { label: 'Behaviors', val: row.behaviors },
                  { label: 'DbContexts', val: row.dbContexts },
                ].map((stat) => (
                  <div key={stat.label} className="px-3.5 py-2.5 sm:px-4 sm:py-3">
                    <dt className="font-editorial-sans text-[0.75rem] text-[var(--color-text-muted)]">
                      {stat.label}
                    </dt>
                    <dd className="mt-0.5 mb-0 font-editorial-mono text-sm font-medium text-[var(--color-text-primary)]">
                      {stat.val}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full border-collapse text-left tabular-data">
            <thead>
              <tr className="border-b border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] font-editorial-sans text-xs text-[var(--color-text-secondary)] xl:text-[0.8125rem]">
                <th scope="col" className="px-3.5 py-3.5 font-medium xl:px-5">
                  Repository
                </th>
                <th scope="col" className="px-2 py-3.5 text-right font-medium xl:px-4">
                  Projects
                </th>
                <th scope="col" className="px-2 py-3.5 text-right font-medium xl:px-4">
                  Requests
                </th>
                <th scope="col" className="px-2 py-3.5 text-right font-medium xl:px-4">
                  Handlers
                </th>
                <th scope="col" className="px-2 py-3.5 text-right font-medium xl:px-4">
                  Validators
                </th>
                <th scope="col" className="px-2 py-3.5 text-right font-medium xl:px-4">
                  Behaviors
                </th>
                <th scope="col" className="px-2 py-3.5 text-right font-medium xl:px-4">
                  DbContexts
                </th>
                <th scope="col" className="px-3.5 py-3.5 text-right font-medium whitespace-nowrap xl:px-5">
                  Checks
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)] text-xs xl:text-[0.8125rem]">
              {CORPUS.map((row) => (
                <tr key={row.url}>
                  <td className="px-3.5 py-3.5 font-editorial-mono xl:px-5">
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[var(--color-text-primary)] no-underline hover:underline"
                    >
                      <span className="text-[var(--color-text-muted)]">{row.owner}</span>
                      <span className="font-medium">{row.repo}</span>
                      <ArrowUpRightIcon className="size-3 shrink-0 text-[var(--color-text-muted)]" />
                    </a>
                  </td>
                  <td className="px-2 py-3.5 text-right font-editorial-sans text-[0.8125rem] text-[var(--color-text-primary)] xl:px-4 xl:text-sm">
                    {row.projects}
                  </td>
                  <td className="px-2 py-3.5 text-right font-editorial-sans text-[0.8125rem] text-[var(--color-text-primary)] xl:px-4 xl:text-sm">
                    {row.requests}
                  </td>
                  <td className="px-2 py-3.5 text-right font-editorial-sans text-[0.8125rem] text-[var(--color-text-primary)] xl:px-4 xl:text-sm">
                    {row.handlers}
                  </td>
                  <td className="px-2 py-3.5 text-right font-editorial-sans text-[0.8125rem] text-[var(--color-text-secondary)] xl:px-4 xl:text-sm">
                    {row.validators}
                  </td>
                  <td className="px-2 py-3.5 text-right font-editorial-sans text-[0.8125rem] text-[var(--color-text-secondary)] xl:px-4 xl:text-sm">
                    {row.behaviors}
                  </td>
                  <td className="px-2 py-3.5 text-right font-editorial-sans text-[0.8125rem] text-[var(--color-text-secondary)] xl:px-4 xl:text-sm">
                    {row.dbContexts}
                  </td>
                  <td className="px-3.5 py-3.5 text-right font-editorial-sans text-xs font-medium whitespace-nowrap text-[var(--color-role-pass-fg)] xl:px-5 xl:text-[0.8125rem]">
                    {row.findings}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5 flex justify-start sm:justify-end">
        <Link to="/examples" className="link-quiet">
          <span>Inspect corpus snapshots &amp; real vertical-slice traces</span>
          <ChevronRightIcon className="size-3.5" />
        </Link>
      </div>
    </div>
  </section>
);
