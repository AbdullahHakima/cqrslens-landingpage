import React, { useState } from 'react';
import { Link } from '../../lib/router';
import { ChevronRightIcon } from '../ui/Icons';

interface RuleSpec {
  id: string;
  severity: 'error' | 'warning';
  summary: string;
}

const RULES: readonly RuleSpec[] = [
  {
    id: 'MissingHandler',
    severity: 'error',
    summary: 'A discovered CQRS command or query has zero linked handlers.',
  },
  {
    id: 'MultipleHandlers',
    severity: 'error',
    summary: 'More than one handler targets the same request contract.',
  },
  {
    id: 'LayerViolation',
    severity: 'error',
    summary: 'A Domain project references Infrastructure, Api, Web, or UI.',
  },
  {
    id: 'ApplicationLayerViolation',
    severity: 'error',
    summary: 'An Application project references Infrastructure, Api, Web, or UI.',
  },
  {
    id: 'CircularProjectDependency',
    severity: 'error',
    summary: 'A dependency cycle exists in the resolved .csproj reference graph.',
  },
  {
    id: 'CommandWithoutValidator',
    severity: 'warning',
    summary: 'A state-mutating Command has no FluentValidation or FastEndpoints validator.',
  },
  {
    id: 'OrphanValidator',
    severity: 'warning',
    summary: 'A validator targets a type that matches no discovered CQRS request.',
  },
  {
    id: 'OrphanNotification',
    severity: 'warning',
    summary: 'An INotification or IDomainEvent has zero notification handlers.',
  },
  {
    id: 'UnreachableRequest',
    severity: 'warning',
    summary: 'A request has a handler, but no production Send() call site dispatches it.',
  },
  {
    id: 'UnpublishedNotification',
    severity: 'warning',
    summary: 'A domain event has handlers, but no production Publish() site emits it.',
  },
  {
    id: 'AmbiguousProjectName',
    severity: 'warning',
    summary: 'Duplicate project names make cross-folder reference resolution ambiguous.',
  },
];

export const ChecksLedgerSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'error' | 'warning'>('all');

  const visibleRules =
    filter === 'all' ? RULES : RULES.filter((rule) => rule.severity === filter);

  return (
    <section
      id="checks"
      aria-labelledby="checks-heading"
      className="cv-auto border-t border-[var(--color-border-subtle)] py-14 sm:py-18 md:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end md:gap-6">
          <div className="max-w-[33rem]">
            <h2
              id="checks-heading"
              className="m-0 text-[clamp(1.7rem,3.2vw,2.65rem)] font-medium tracking-[-0.025em] leading-[1.16] text-balance text-[var(--color-text-primary)]"
            >
              Eleven static checks guard every pull request.
            </h2>
            <p className="mt-3 mb-0 max-w-[31rem] text-base leading-[1.6] text-pretty text-[var(--color-text-secondary)]">
              Configure rule severities per repository in{' '}
              <code className="font-editorial-mono text-[0.875em]">.cqrslens.json</code> (
              <code className="font-editorial-mono text-[0.875em]">error</code>,{' '}
              <code className="font-editorial-mono text-[0.875em]">warning</code>, or{' '}
              <code className="font-editorial-mono text-[0.875em]">off</code>). In{' '}
              <code className="font-editorial-mono text-[0.875em]">--strict</code> mode, errors exit
              with code <code className="font-editorial-mono text-[0.875em]">4</code> only when the
              scan is complete enough to trust.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter architecture checks by severity"
            className="flex flex-wrap gap-2"
          >
            {(
              [
                { key: 'all', label: 'All (11)' },
                { key: 'error', label: 'Errors (5)' },
                { key: 'warning', label: 'Warnings (6)' },
              ] as const
            ).map((btn) => {
              const active = filter === btn.key;
              return (
                <button
                  key={btn.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(btn.key)}
                  className={`min-h-[44px] cursor-pointer rounded-[4px] border px-3.5 font-editorial-sans text-[0.8125rem] font-medium tabular-data transition-colors duration-150 ${
                    active
                      ? 'border-[var(--color-action-solid)] bg-[var(--color-action-solid)] text-[var(--color-action-text)]'
                      : 'border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]'
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stacked Mobile Ledger (< md) + Full 3-Column Table (md+) */}
        <div className="mt-8 border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] sm:mt-10">
          <ul className="m-0 list-none divide-y divide-[var(--color-border-subtle)] p-0 md:hidden">
            {visibleRules.map((rule) => (
              <li key={rule.id} className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link
                    to={`/rules#${rule.id}`}
                    className="inline-flex min-h-[44px] items-center break-words [overflow-wrap:anywhere] font-editorial-mono text-[0.8125rem] font-medium text-[var(--color-text-primary)] no-underline hover:underline"
                  >
                    {rule.id}
                  </Link>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-[3px] px-2 py-0.5 font-editorial-mono text-xs font-medium ${
                      rule.severity === 'error'
                        ? 'bg-[var(--color-role-error-bg)] text-[var(--color-role-error-fg)]'
                        : 'bg-[var(--color-role-warn-bg)] text-[var(--color-role-warn-fg)]'
                    }`}
                  >
                    <span aria-hidden="true">
                      {rule.severity === 'error' ? '[!]' : '[~]'}
                    </span>
                    <span>{rule.severity}</span>
                  </span>
                </div>
                <p className="mt-1.5 mb-0 font-editorial-sans text-sm leading-[1.55] text-pretty text-[var(--color-text-secondary)]">
                  {rule.summary}
                </p>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] font-editorial-sans text-[0.8125rem] text-[var(--color-text-secondary)]">
                  <th scope="col" className="w-64 px-5 py-3.5 font-medium lg:w-72">
                    Rule Identifier
                  </th>
                  <th scope="col" className="w-36 px-5 py-3.5 font-medium">
                    Default Severity
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-medium">
                    Condition Detected
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)]">
                {visibleRules.map((rule) => (
                  <tr key={rule.id}>
                    <td className="px-5 py-3.5 font-editorial-mono text-[0.8125rem] font-medium text-[var(--color-text-primary)]">
                      <Link
                        to={`/rules#${rule.id}`}
                        className="text-[var(--color-text-primary)] no-underline hover:underline"
                      >
                        {rule.id}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-[3px] px-2 py-0.5 font-editorial-mono text-xs font-medium ${
                          rule.severity === 'error'
                            ? 'bg-[var(--color-role-error-bg)] text-[var(--color-role-error-fg)]'
                            : 'bg-[var(--color-role-warn-bg)] text-[var(--color-role-warn-fg)]'
                        }`}
                      >
                        <span aria-hidden="true">
                          {rule.severity === 'error' ? '[!]' : '[~]'}
                        </span>
                        <span>{rule.severity}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-editorial-sans text-sm text-[var(--color-text-secondary)]">
                      <span className="block max-w-[32rem]">{rule.summary}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 flex justify-start sm:justify-end">
          <Link to="/rules" className="link-quiet">
            <span>Inspect C# violation &amp; fix examples for all 11 rules</span>
            <ChevronRightIcon className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
