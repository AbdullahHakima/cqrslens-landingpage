import React, { useMemo, useState } from 'react';
import { BRAND } from '../config/brand';
import {
  ARCHITECTURE_RULES,
  RuleCategory,
  RuleSeverity,
} from '../data/rules';
import { Link } from '../lib/router';
import { PageMasthead } from '../components/layout/PageMasthead';
import { CodeBlock } from '../components/ui/CodeBlock';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  LinkAnchorIcon,
  SearchIcon,
} from '../components/ui/Icons';

const CATEGORIES: readonly ('All' | RuleCategory)[] = [
  'All',
  'CQRS Wiring',
  'Clean Architecture Layers',
  'Validation & Hygiene',
  'Reachability & Events',
];

const SEVERITY_STYLES: Record<RuleSeverity, string> = {
  error: 'bg-[var(--color-role-error-bg)] text-[var(--color-role-error-fg)]',
  warning: 'bg-[var(--color-role-warn-bg)] text-[var(--color-role-warn-fg)]',
  conditional: 'bg-[var(--color-role-query-bg)] text-[var(--color-role-query-fg)]',
};

const SEVERITY_SYMBOLS: Record<RuleSeverity, string> = {
  error: '[!]',
  warning: '[~]',
  conditional: '[?]',
};

const SEVERITY_ABBREVIATIONS: Record<RuleSeverity, string> = {
  error: 'ERR',
  warning: 'WARN',
  conditional: 'COND',
};

const SEVERITY_OPTIONS = [
  { id: 'all', label: `All (${ARCHITECTURE_RULES.length})` },
  {
    id: 'error',
    label: `Errors (${ARCHITECTURE_RULES.filter((rule) => rule.severity === 'error').length})`,
  },
  {
    id: 'conditional',
    label: `Conditional (${ARCHITECTURE_RULES.filter((rule) => rule.severity === 'conditional').length})`,
  },
  {
    id: 'warning',
    label: `Warnings (${ARCHITECTURE_RULES.filter((rule) => rule.severity === 'warning').length})`,
  },
] as const;

export const RulesPage: React.FC = () => {
  const [severityFilter, setSeverityFilter] = useState<'all' | RuleSeverity>('all');
  const [categoryFilter, setCategoryFilter] = useState<'All' | RuleCategory>('All');
  const [query, setQuery] = useState('');
  const [copiedRuleId, setCopiedRuleId] = useState<string | null>(null);

  const filteredRules = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARCHITECTURE_RULES.filter((rule) => {
      if (severityFilter !== 'all' && rule.severity !== severityFilter) return false;
      if (categoryFilter !== 'All' && rule.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        rule.id.toLowerCase().includes(q) ||
        rule.summary.toLowerCase().includes(q) ||
        rule.category.toLowerCase().includes(q)
      );
    });
  }, [categoryFilter, query, severityFilter]);

  const handleCopyAnchor = async (ruleId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${ruleId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback update URL hash directly
    }
    window.history.replaceState(null, '', `${window.location.pathname}#${ruleId}`);
    setCopiedRuleId(ruleId);
    window.setTimeout(() => {
      setCopiedRuleId((curr) => (curr === ruleId ? null : curr));
    }, 1800);
  };

  return (
    <>
      <PageMasthead
        pixelLines={['RULES']}
        srTitle={`Static Architecture Rules Catalog — ${BRAND.name}`}
        summary="Specification for all eleven deterministic CQRS and Clean Architecture checks. Every rule has a stable anchor URL for SARIF diagnostics, .cqrslens.json severity tuning, and C# violation vs. resolution patterns."
        aside={
          <Link to="/docs/configuration" className="link-quiet">
            <span>Configure .cqrslens.json</span>
            <ChevronRightIcon className="size-3.5" />
          </Link>
        }
      />

      {/* Filter & Search Bar */}
      <section
        aria-label="Filter static architecture rules"
        className="border-b border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] py-5 sm:py-6"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-[22rem]">
              <label htmlFor="rules-search-input" className="sr-only">
                Search rules by identifier or condition
              </label>
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                id="rules-search-input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by rule ID or keyword..."
                className="min-h-[44px] w-full rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] pr-3.5 pl-9 font-editorial-mono text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
              />
            </div>

            {/* Severity Toggle */}
            <div
              role="group"
              aria-label="Filter by default severity"
              className="flex flex-wrap items-center gap-2"
            >
              {SEVERITY_OPTIONS.map((btn) => {
                const active = severityFilter === btn.id;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSeverityFilter(btn.id)}
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
          </div>

          {/* Category Filter Row */}
          <div
            role="group"
            aria-label="Filter by architectural category"
            className="mt-4 flex flex-wrap gap-2"
          >
            {CATEGORIES.map((cat) => {
              const active = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategoryFilter(cat)}
                  className={`min-h-[44px] min-w-[44px] cursor-pointer rounded-[4px] border px-3 font-editorial-sans text-xs font-medium transition-colors duration-150 ${
                    active
                      ? 'border-[var(--color-text-primary)] bg-[var(--color-bg-sunken)] text-[var(--color-text-primary)]'
                      : 'border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Two-Column Specification Ledger */}
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 sm:py-12 md:py-16 lg:px-12">
        {filteredRules.length === 0 ? (
          <div className="border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] p-6 sm:p-8">
            <h2 className="m-0 font-editorial-sans text-lg font-medium text-[var(--color-text-primary)]">
              No rules matched "{query}"
            </h2>
            <p className="mt-2 mb-5 font-editorial-sans text-sm text-[var(--color-text-secondary)]">
              Reset the search filter or severity selection to view all 11 static checks.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSeverityFilter('all');
                setCategoryFilter('All');
              }}
              className="btn-primary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Mobile / Tablet Quick Jump Select (< lg) */}
            <div className="lg:hidden">
              <label htmlFor="rules-jump-select" className="sr-only">
                Jump directly to a rule specification
              </label>
              <div className="relative">
                <select
                  id="rules-jump-select"
                  defaultValue=""
                  onChange={(e) => {
                    const ruleId = e.target.value;
                    if (!ruleId) return;
                    const el = document.getElementById(ruleId);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      window.history.replaceState(null, '', `${window.location.pathname}#${ruleId}`);
                    }
                    e.target.value = '';
                  }}
                  className="min-h-[44px] w-full appearance-none rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] py-2 pr-9 pl-3.5 font-editorial-mono text-xs text-[var(--color-text-primary)]"
                >
                  <option value="" disabled>
                    Jump to rule ({filteredRules.length} shown)...
                  </option>
                  {filteredRules.map((rule) => (
                    <option key={rule.id} value={rule.id}>
                      {rule.id} [{SEVERITY_ABBREVIATIONS[rule.severity]}]
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-[var(--color-text-secondary)]" />
              </div>
            </div>

            {/* Left Sticky Rule Index (lg+) */}
            <aside
              aria-label="Jump to rule specification"
              className="hidden lg:col-span-3 lg:block"
            >
              <nav className="sticky top-26 border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)]">
                <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)] px-4 py-2.5 font-editorial-mono text-xs text-[var(--color-text-secondary)]">
                  Showing {filteredRules.length} of {ARCHITECTURE_RULES.length} rules
                </div>
                <ul className="m-0 divide-y divide-[var(--color-border-subtle)] list-none p-0">
                  {filteredRules.map((rule) => (
                    <li key={rule.id}>
                      <Link
                        to={`#${rule.id}`}
                        className="flex min-h-[44px] items-center justify-between gap-2 px-4 py-2 font-editorial-mono text-xs text-[var(--color-text-primary)] no-underline transition-colors duration-150 hover:bg-[var(--color-bg-subtle)]"
                      >
                        <span className="truncate">{rule.id}</span>
                        <span
                          className={`shrink-0 rounded-[3px] px-1.5 py-0.5 text-[0.65rem] ${SEVERITY_STYLES[rule.severity]}`}
                        >
                          {SEVERITY_ABBREVIATIONS[rule.severity]}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Right Detailed Rule Entries */}
            <div className="min-w-0 divide-y divide-[var(--color-border-strong)] border-t border-[var(--color-border-strong)] lg:col-span-9">
              {filteredRules.map((rule) => (
                <article
                  key={rule.id}
                  id={rule.id}
                  aria-labelledby={`rule-title-${rule.id}`}
                  className="scroll-mt-24 py-10 first:pt-7 sm:py-12 sm:first:pt-8"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-wrap items-center gap-2.5 sm:gap-3">
                      <h2
                        id={`rule-title-${rule.id}`}
                        className="m-0 break-words [overflow-wrap:anywhere] font-editorial-mono text-[clamp(1.15rem,2.1vw,1.55rem)] font-medium text-[var(--color-text-primary)]"
                      >
                        {rule.id}
                      </h2>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-[3px] px-2.5 py-1 font-editorial-mono text-xs font-medium ${SEVERITY_STYLES[rule.severity]}`}
                      >
                        <span aria-hidden="true">{SEVERITY_SYMBOLS[rule.severity]}</span>
                        <span>default: {rule.severity}</span>
                      </span>

                      <span className="rounded-[3px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)] px-2.5 py-1 font-editorial-sans text-xs text-[var(--color-text-secondary)]">
                        {rule.category}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyAnchor(rule.id)}
                      aria-label={`Copy direct link to ${rule.id}`}
                      className="inline-flex min-h-[44px] max-w-full cursor-pointer items-center gap-1.5 rounded-[4px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-3 font-editorial-mono text-xs text-[var(--color-text-secondary)] transition-colors duration-150 hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
                    >
                      {copiedRuleId === rule.id ? (
                        <>
                          <CheckIcon className="size-3.5 shrink-0" />
                          <span>Link copied</span>
                        </>
                      ) : (
                        <>
                          <LinkAnchorIcon className="size-3.5 shrink-0" />
                          <span className="truncate">#{rule.id}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="mt-3 mb-0 max-w-[42rem] font-editorial-sans text-base font-medium leading-[1.55] text-[var(--color-text-primary)]">
                    {rule.summary}
                  </p>
                  <p className="mt-2 mb-0 max-w-[42rem] font-editorial-sans text-[0.9375rem] leading-[1.62] text-pretty text-[var(--color-text-secondary)]">
                    {rule.rationale}
                  </p>
                  {rule.severityNote && (
                    <p className="mt-3 mb-0 max-w-[42rem] border-l-2 border-[var(--color-role-warn-fg)] pl-3 font-editorial-sans text-sm leading-[1.55] text-[var(--color-text-secondary)]">
                      {rule.severityNote}
                    </p>
                  )}

                  {/* Side-by-Side Violation vs. Clean Resolution */}
                  <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
                    <CodeBlock
                      label={rule.violationTitle}
                      badge="[VIOLATION]"
                      code={rule.violationCode}
                      tone="elevated"
                    />
                    <CodeBlock
                      label={rule.resolutionTitle}
                      badge="[CLEAN FIX]"
                      code={rule.resolutionCode}
                      tone="inverse"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RulesPage;
