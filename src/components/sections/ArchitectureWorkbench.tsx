import React, { useState } from 'react';
import { BRAND } from '../../config/brand';

type WorkbenchTab = 'slice' | 'topology' | 'mcp' | 'ci';

interface SliceTrace {
  id: string;
  name: string;
  kind: 'Command' | 'Query';
  project: string;
  endpoint: string;
  requestLoc: string;
  responseType: string;
  validator: string | null;
  validatorLoc: string | null;
  behaviors: string[];
  handler: string;
  handlerLoc: string;
  dbSets: string[];
  publishedEvents: string[];
  finding: { rule: string; severity: 'warning' | 'pass'; message: string };
}

const SLICES: readonly SliceTrace[] = [
  {
    id: 'create-order',
    name: 'CreateOrderCommand',
    kind: 'Command',
    project: 'SampleShop.Application',
    endpoint: 'POST /api/orders  (OrdersEndpoints.cs:24)',
    requestLoc: 'Orders/Commands/CreateOrder/CreateOrderCommand.cs:9',
    responseType: 'Guid',
    validator: 'CreateOrderCommandValidator',
    validatorLoc: 'Orders/Commands/CreateOrder/CreateOrderCommandValidator.cs:7',
    behaviors: ['ValidationBehavior<TRequest, TResponse>'],
    handler: 'CreateOrderCommandHandler',
    handlerLoc: 'Orders/Commands/CreateOrder/CreateOrderCommandHandler.cs:14',
    dbSets: ['ShopDbContext.Orders', 'ShopDbContext.OrderLines', 'ShopDbContext.Customers'],
    publishedEvents: ['OrderPlacedNotification -> SendOrderConfirmationHandler'],
    finding: {
      rule: 'AllChecksPassed',
      severity: 'pass',
      message: 'Reachable dispatch site, single handler, FluentValidation guard linked.',
    },
  },
  {
    id: 'delete-order',
    name: 'DeleteOrderCommand',
    kind: 'Command',
    project: 'SampleShop.Application',
    endpoint: 'DELETE /api/orders/{id:guid}  (OrdersEndpoints.cs:41)',
    requestLoc: 'Orders/Commands/DeleteOrder/DeleteOrderCommand.cs:6',
    responseType: 'Unit',
    validator: 'DeleteOrderCommandValidator',
    validatorLoc: 'Orders/Commands/DeleteOrder/DeleteOrderCommandValidator.cs:5',
    behaviors: ['ValidationBehavior<TRequest, TResponse>'],
    handler: 'DeleteOrderCommandHandler',
    handlerLoc: 'Orders/Commands/DeleteOrder/DeleteOrderCommandHandler.cs:11',
    dbSets: ['ShopDbContext.Orders'],
    publishedEvents: [],
    finding: {
      rule: 'AllChecksPassed',
      severity: 'pass',
      message: 'Verified end-to-end command slice with zero layer violations.',
    },
  },
  {
    id: 'toggle-like',
    name: 'TogglePostLikeCommand',
    kind: 'Command',
    project: 'ElHakim.Application',
    endpoint: 'POST /api/posts/{id}/like  (LikesController.cs:32)',
    requestLoc: 'Features/Likes/Commands/TogglePostLikeCommand.cs:8',
    responseType: 'LikeStatusDto',
    validator: null,
    validatorLoc: null,
    behaviors: ['LoggingBehavior<TRequest, TResponse>'],
    handler: 'TogglePostLikeCommandHandler',
    handlerLoc: 'Features/Likes/Commands/TogglePostLikeCommandHandler.cs:16',
    dbSets: ['AppDbContext.PostLikes', 'AppDbContext.Posts'],
    publishedEvents: [],
    finding: {
      rule: 'CommandWithoutValidator',
      severity: 'warning',
      message: 'Disambiguated from Posts.TogglePostLikeCommand by namespace; missing validator.',
    },
  },
  {
    id: 'get-products',
    name: 'GetProductListQuery',
    kind: 'Query',
    project: 'SampleShop.Application',
    endpoint: 'GET /api/products  (ProductsEndpoints.cs:18)',
    requestLoc: 'Products/Queries/GetProductList/GetProductListQuery.cs:6',
    responseType: 'List<ProductDto>',
    validator: null,
    validatorLoc: null,
    behaviors: ['ValidationBehavior<TRequest, TResponse>'],
    handler: 'GetProductListQueryHandler',
    handlerLoc: 'Products/Queries/GetProductList/GetProductListQueryHandler.cs:12',
    dbSets: ['ShopDbContext.Products (AsNoTracking)'],
    publishedEvents: [],
    finding: {
      rule: 'AllChecksPassed',
      severity: 'pass',
      message: 'Read-only query slice; validator optional under default rule set.',
    },
  },
];

const TABS: ReadonlyArray<{ id: WorkbenchTab; label: string; flag: string }> = [
  { id: 'slice', label: 'Vertical Slice', flag: '--slice' },
  { id: 'topology', label: 'Layer & CQRS Map', flag: 'ARCHITECTURE.md' },
  { id: 'mcp', label: 'MCP Agent Server', flag: '--mcp' },
  { id: 'ci', label: 'PR Diff & Strict CI', flag: '--diff --strict' },
];

export const ArchitectureWorkbench: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WorkbenchTab>('slice');
  const [selectedSliceId, setSelectedSliceId] = useState<string>(SLICES[0].id);

  const activeSlice = SLICES.find((s) => s.id === selectedSliceId) ?? SLICES[0];

  const handleTabKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const nextIdx =
      e.key === 'ArrowRight'
        ? (idx + 1) % TABS.length
        : (idx - 1 + TABS.length) % TABS.length;
    setActiveTab(TABS[nextIdx].id);
    const btn = document.getElementById(`wb-tab-${TABS[nextIdx].id}`);
    btn?.focus();
  };

  return (
    <section
      id="workbench"
      aria-labelledby="workbench-heading"
      className="border-t border-[var(--color-border-subtle)] py-14 sm:py-18 md:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
            <h2
              id="workbench-heading"
              className="m-0 text-[clamp(1.7rem,3.4vw,2.85rem)] font-medium tracking-[-0.025em] leading-[1.16] text-balance text-[var(--color-text-primary)]"
            >
              One static pass reveals the map nobody wrote down.
            </h2>
          </div>
          <div className="min-w-0 lg:col-span-5 lg:flex lg:items-end">
            <p className="m-0 max-w-[31rem] text-base leading-[1.6] text-pretty text-[var(--color-text-secondary)]">
              Point <code className="font-editorial-mono text-[0.9em]">{BRAND.cliBinary}</code> at an
              inherited repository, or connect it to your coding agent over MCP, to inspect every
              vertical slice without running{' '}
              <code className="font-editorial-mono text-[0.9em]">dotnet build</code>.
            </p>
          </div>
        </div>

        {/* Accessible Single-Baseline Tab Bar */}
        <div
          role="tablist"
          aria-label="Architecture output modes"
          className="tablist-scroll mt-8 border-b border-[var(--color-border-strong)] sm:mt-12"
        >
          {TABS.map((tab, idx) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`wb-tab-${tab.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`wb-panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
                className={`inline-flex min-h-[46px] shrink-0 cursor-pointer items-center gap-2.5 border-b-2 px-3.5 py-2.5 font-editorial-sans text-sm whitespace-nowrap transition-colors duration-150 sm:px-5 ${
                  selected
                    ? 'border-[var(--color-text-primary)] font-medium text-[var(--color-text-primary)]'
                    : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <span>{tab.label}</span>
                <code className="hidden rounded-[3px] bg-[var(--color-bg-sunken)] px-1.5 py-0.5 font-editorial-mono text-[0.7rem] text-[var(--color-text-secondary)] xl:inline">
                  {tab.flag}
                </code>
              </button>
            );
          })}
        </div>

        {/* Workbench Surface */}
        <div className="border-x border-b border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)]">
          {activeTab === 'slice' && (
            <div
              id="wb-panel-slice"
              role="tabpanel"
              aria-labelledby="wb-tab-slice"
              className="grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Left Slice Selector Ledger */}
              <div className="min-w-0 border-b border-[var(--color-border-subtle)] lg:col-span-4 lg:border-r lg:border-b-0">
                <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)] px-4 py-3 text-xs text-[var(--color-text-secondary)] sm:px-5">
                  <code className="font-editorial-mono">
                    $ {BRAND.cliBinary} . --slice &lt;query&gt;
                  </code>
                </div>
                <div className="grid grid-cols-1 divide-y divide-[var(--color-border-subtle)] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-1 lg:divide-y">
                  {SLICES.map((slice, sIdx) => {
                    const isCurrent = slice.id === activeSlice.id;
                    const tabletCellBorders =
                      (sIdx < 2 ? 'sm:border-b ' : '') +
                      (sIdx % 2 === 0 ? 'sm:border-r ' : '') +
                      'sm:border-[var(--color-border-subtle)] lg:border-r-0';
                    return (
                      <button
                        key={slice.id}
                        type="button"
                        onClick={() => setSelectedSliceId(slice.id)}
                        className={`flex min-h-[48px] w-full min-w-0 cursor-pointer flex-col items-start gap-1.5 px-4 py-3.5 text-left transition-colors duration-150 sm:px-5 sm:py-4 ${tabletCellBorders} ${
                          isCurrent
                            ? 'bg-[var(--color-bg-sunken)]'
                            : 'bg-transparent hover:bg-[var(--color-bg-subtle)]'
                        }`}
                      >
                        <div className="flex w-full min-w-0 items-center justify-between gap-2">
                          <span className="min-w-0 truncate font-editorial-mono text-xs font-medium text-[var(--color-text-primary)] sm:text-[0.8125rem]">
                            {slice.name}
                          </span>
                          <span
                            className={`shrink-0 rounded-[3px] px-1.5 py-0.5 font-editorial-mono text-[0.6875rem] font-medium ${
                              slice.kind === 'Command'
                                ? 'bg-[var(--color-role-command-bg)] text-[var(--color-role-command-fg)]'
                                : 'bg-[var(--color-role-query-bg)] text-[var(--color-role-query-fg)]'
                            }`}
                          >
                            {slice.kind}
                          </span>
                        </div>
                        <span className="w-full truncate font-editorial-mono text-xs text-[var(--color-text-muted)]">
                          {slice.project} → {slice.responseType}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right End-to-End Trace Blueprint */}
              <div className="min-w-0 p-4 sm:p-7 lg:col-span-8">
                <div className="flex flex-col items-start gap-2.5 border-b border-[var(--color-border-subtle)] pb-4 sm:flex-row sm:justify-between sm:gap-3">
                  <div className="w-full min-w-0 sm:flex-1">
                    <div className="break-words [overflow-wrap:anywhere] font-editorial-mono text-xs font-medium text-[var(--color-text-primary)] sm:text-sm">
                      {activeSlice.name}{' '}
                      <span className="text-[var(--color-text-muted)]">
                        : IRequest&lt;{activeSlice.responseType}&gt;
                      </span>
                    </div>
                    <div className="mt-1 break-words [overflow-wrap:anywhere] font-editorial-mono text-xs text-[var(--color-text-muted)]">
                      {activeSlice.requestLoc}
                    </div>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-[3px] px-2.5 py-1 font-editorial-mono text-xs font-medium ${
                      activeSlice.finding.severity === 'pass'
                        ? 'bg-[var(--color-role-pass-bg)] text-[var(--color-role-pass-fg)]'
                        : 'bg-[var(--color-role-warn-bg)] text-[var(--color-role-warn-fg)]'
                    }`}
                  >
                    <span>
                      {activeSlice.finding.severity === 'pass' ? '[PASS]' : '[WARN]'}
                    </span>
                    <span>{activeSlice.finding.rule}</span>
                  </span>
                </div>

                <dl className="mt-5 grid grid-cols-1 gap-3.5 text-xs sm:mt-6 sm:grid-cols-12 sm:gap-4 sm:gap-y-5">
                  <dt className="font-editorial-sans text-[0.8125rem] font-medium text-[var(--color-text-muted)] sm:col-span-3">
                    Dispatch Site
                  </dt>
                  <dd className="m-0 min-w-0 break-words [overflow-wrap:anywhere] font-editorial-mono text-[var(--color-text-primary)] sm:col-span-9">
                    {activeSlice.endpoint}
                  </dd>

                  <dt className="font-editorial-sans text-[0.8125rem] font-medium text-[var(--color-text-muted)] sm:col-span-3">
                    Validator
                  </dt>
                  <dd className="m-0 min-w-0 sm:col-span-9">
                    {activeSlice.validator ? (
                      <div className="break-words [overflow-wrap:anywhere] font-editorial-mono">
                        <span className="text-[var(--color-text-primary)]">
                          {activeSlice.validator}
                        </span>
                        <span className="mt-0.5 block text-[var(--color-text-muted)]">
                          {activeSlice.validatorLoc}
                        </span>
                      </div>
                    ) : (
                      <span className="font-editorial-sans text-[0.8125rem] text-[var(--color-role-warn-fg)]">
                        None linked (FluentValidation or FastEndpoints)
                      </span>
                    )}
                  </dd>

                  <dt className="font-editorial-sans text-[0.8125rem] font-medium text-[var(--color-text-muted)] sm:col-span-3">
                    Pipeline
                  </dt>
                  <dd className="m-0 min-w-0 break-words [overflow-wrap:anywhere] font-editorial-mono text-[var(--color-text-primary)] sm:col-span-9">
                    {activeSlice.behaviors.join(' -> ')}
                  </dd>

                  <dt className="font-editorial-sans text-[0.8125rem] font-medium text-[var(--color-text-muted)] sm:col-span-3">
                    Handler
                  </dt>
                  <dd className="m-0 min-w-0 break-words [overflow-wrap:anywhere] font-editorial-mono sm:col-span-9">
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {activeSlice.handler}
                    </span>
                    <span className="mt-0.5 block text-[var(--color-text-muted)]">
                      {activeSlice.handlerLoc}
                    </span>
                  </dd>

                  <dt className="font-editorial-sans text-[0.8125rem] font-medium text-[var(--color-text-muted)] sm:col-span-3">
                    EF Core DbSets
                  </dt>
                  <dd className="m-0 flex min-w-0 flex-wrap gap-2 font-editorial-mono sm:col-span-9">
                    {activeSlice.dbSets.map((db) => (
                      <span
                        key={db}
                        className="max-w-full break-words [overflow-wrap:anywhere] rounded-[3px] border border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] px-2 py-0.5 text-[var(--color-text-primary)]"
                      >
                        {db}
                      </span>
                    ))}
                  </dd>

                  <dt className="font-editorial-sans text-[0.8125rem] font-medium text-[var(--color-text-muted)] sm:col-span-3">
                    Domain Events
                  </dt>
                  <dd className="m-0 min-w-0 sm:col-span-9">
                    {activeSlice.publishedEvents.length > 0 ? (
                      <span className="block break-words [overflow-wrap:anywhere] font-editorial-mono text-[var(--color-text-primary)]">
                        {activeSlice.publishedEvents.join(', ')}
                      </span>
                    ) : (
                      <span className="font-editorial-sans text-[0.8125rem] text-[var(--color-text-secondary)]">
                        No INotification or IDomainEvent published in slice
                      </span>
                    )}
                  </dd>
                </dl>

                <p className="mt-6 mb-0 max-w-[32rem] border-t border-[var(--color-border-subtle)] pt-4 font-editorial-sans text-sm text-[var(--color-text-secondary)]">
                  {activeSlice.finding.message}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'topology' && (
            <div
              id="wb-panel-topology"
              role="tabpanel"
              aria-labelledby="wb-tab-topology"
              className="grid grid-cols-1 lg:grid-cols-12"
            >
              <div className="min-w-0 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-inverse)] p-4 text-[var(--color-text-on-inverse)] sm:p-7 lg:col-span-6 lg:border-r lg:border-b-0">
                <div className="break-words [overflow-wrap:anywhere] font-editorial-mono text-xs text-[var(--color-text-on-inverse-muted)]">
                  $ {BRAND.cliBinary} samples/SampleShop --format html --render svg
                </div>
                <pre className="mt-4 overflow-x-auto font-editorial-mono text-[0.71875rem] leading-[1.65] text-[var(--color-text-on-inverse)] sm:text-xs">
{`SampleShop Architecture Summary
------------------------------------------------------
Projects                      4  (Api, App, Infra, Domain)
Requests (Commands/Queries)   4  (2 Commands, 2 Queries)
Handlers                      4  (100% linked)
Validators                    2  (FluentValidation)
Pipeline Behaviors            1  (ValidationBehavior)
EF Core DbContexts            1  (ShopDbContext · 4 entities)
Scanner / Timing              text · 18 ms · 0.65 MB
Architecture Checks           PASSED (0 errors, 0 warnings)
------------------------------------------------------
Written: samples/SampleShop/ARCHITECTURE.html (zero-JS SVG)`}
                </pre>
              </div>

              <div className="min-w-0 p-4 sm:p-7 lg:col-span-6">
                <div className="font-editorial-mono text-xs text-[var(--color-text-muted)]">
                  Compiled Offline SVG Layer Graph (--render svg)
                </div>
                <div className="mt-4 overflow-x-auto">
                  <svg
                    viewBox="0 0 520 230"
                    role="img"
                    aria-label="Clean Architecture dependency graph showing Api and Infrastructure pointing inward to Application and Domain"
                    className="block h-auto w-full min-w-[400px] max-w-[520px] sm:min-w-0"
                  >
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    className="text-[var(--color-text-secondary)]"
                  >
                    {/* Api -> Application */}
                    <path d="M130 62 L210 104" />
                    {/* Api -> Infrastructure */}
                    <path d="M155 46 L310 46" />
                    {/* Infrastructure -> Application */}
                    <path d="M365 62 L290 104" />
                    {/* Infrastructure -> Domain */}
                    <path d="M390 62 L390 166" />
                    {/* Application -> Domain */}
                    <path d="M295 136 L345 168" />
                  </g>

                  {/* Api Node */}
                  <rect
                    x="35"
                    y="26"
                    width="120"
                    height="36"
                    fill="var(--color-bg-subtle)"
                    stroke="var(--color-text-primary)"
                    strokeWidth="1.4"
                  />
                  <text
                    x="95"
                    y="48"
                    textAnchor="middle"
                    className="fill-[var(--color-text-primary)] font-editorial-mono text-[11px]"
                  >
                    SampleShop.Api
                  </text>

                  {/* Infrastructure Node */}
                  <rect
                    x="310"
                    y="26"
                    width="175"
                    height="36"
                    fill="var(--color-bg-subtle)"
                    stroke="var(--color-text-primary)"
                    strokeWidth="1.4"
                  />
                  <text
                    x="397"
                    y="48"
                    textAnchor="middle"
                    className="fill-[var(--color-text-primary)] font-editorial-mono text-[11px]"
                  >
                    SampleShop.Infrastructure
                  </text>

                  {/* Application Node */}
                  <rect
                    x="165"
                    y="104"
                    width="165"
                    height="36"
                    fill="var(--color-role-command-bg)"
                    stroke="var(--color-role-command-fg)"
                    strokeWidth="1.5"
                  />
                  <text
                    x="247"
                    y="126"
                    textAnchor="middle"
                    className="fill-[var(--color-text-primary)] font-editorial-mono text-[11px] font-medium"
                  >
                    SampleShop.Application
                  </text>

                  {/* Domain Node */}
                  <rect
                    x="318"
                    y="168"
                    width="150"
                    height="36"
                    fill="var(--color-role-pass-bg)"
                    stroke="var(--color-role-pass-fg)"
                    strokeWidth="1.6"
                  />
                  <text
                    x="393"
                    y="190"
                    textAnchor="middle"
                    className="fill-[var(--color-text-primary)] font-editorial-mono text-[11px] font-medium"
                  >
                    SampleShop.Domain
                  </text>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mcp' && (
            <div
              id="wb-panel-mcp"
              role="tabpanel"
              aria-labelledby="wb-tab-mcp"
              className="grid grid-cols-1 lg:grid-cols-12"
            >
              <div className="min-w-0 border-b border-[var(--color-border-subtle)] p-4 sm:p-7 lg:col-span-5 lg:border-r lg:border-b-0">
                <h3 className="m-0 font-editorial-sans text-lg font-medium text-[var(--color-text-primary)]">
                  Built-in Model Context Protocol Server
                </h3>
                <p className="mt-2 mb-5 max-w-[30rem] font-editorial-sans text-sm leading-[1.6] text-[var(--color-text-secondary)]">
                  Run <code className="font-editorial-mono text-xs">{BRAND.cliBinary} . --mcp</code>{' '}
                  so Claude Code, Cursor, or Antigravity queries exact codebase topology instead of
                  grepping hundreds of files.
                </p>
                <ul className="m-0 list-none space-y-3 p-0 text-sm">
                  <li className="border-l-2 border-[var(--color-text-primary)] pl-3">
                    <strong className="block font-editorial-mono text-xs text-[var(--color-text-primary)]">
                      get_architecture_dna
                    </strong>
                    <span className="font-editorial-sans text-[0.8125rem] text-[var(--color-text-secondary)]">
                      Compact layer topology, mediator conventions, DbContexts, and 1-line slice
                      index.
                    </span>
                  </li>
                  <li className="border-l-2 border-[var(--color-border-strong)] pl-3">
                    <strong className="block font-editorial-mono text-xs text-[var(--color-text-primary)]">
                      trace_slice
                    </strong>
                    <span className="font-editorial-sans text-[0.8125rem] text-[var(--color-text-secondary)]">
                      End-to-end File:Line path from endpoint route to handler, DbSets, and events.
                    </span>
                  </li>
                  <li className="border-l-2 border-[var(--color-border-strong)] pl-3">
                    <strong className="block font-editorial-mono text-xs text-[var(--color-text-primary)]">
                      trace_entity_impact
                    </strong>
                    <span className="font-editorial-sans text-[0.8125rem] text-[var(--color-text-secondary)]">
                      Blast-radius map of every command, query, and event touching an EF entity.
                    </span>
                  </li>
                  <li className="border-l-2 border-[var(--color-border-strong)] pl-3">
                    <strong className="block font-editorial-mono text-xs text-[var(--color-text-primary)]">
                      check_architecture
                    </strong>
                    <span className="font-editorial-sans text-[0.8125rem] text-[var(--color-text-secondary)]">
                      Runs all 11 static rules before an agent commits architectural drift.
                    </span>
                  </li>
                </ul>
              </div>
              <div className="min-w-0 bg-[var(--color-bg-inverse)] p-4 text-[var(--color-text-on-inverse)] sm:p-7 lg:col-span-7">
                <div className="font-editorial-mono text-xs text-[var(--color-text-on-inverse-muted)]">
                  mcp_config.json · stdio transport
                </div>
                <pre className="mt-4 overflow-x-auto font-editorial-mono text-[0.71875rem] leading-[1.65] sm:text-xs">
{`{
  "mcpServers": {
    "cqrslens": {
      "command": "cqrslens",
      "args": ["D:/repos/OrderingService", "--mcp"]
    }
  }
}

// Or emit a single token-packed file for agent context windows:
$ cqrslens . --format agent -o ARCHITECTURE.agent.md`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'ci' && (
            <div
              id="wb-panel-ci"
              role="tabpanel"
              aria-labelledby="wb-tab-ci"
              className="grid grid-cols-1 lg:grid-cols-12"
            >
              <div className="min-w-0 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-inverse)] p-4 text-[var(--color-text-on-inverse)] sm:p-7 lg:col-span-7 lg:border-r lg:border-b-0">
                <div className="font-editorial-mono text-xs text-[var(--color-text-on-inverse-muted)]">
                  .github/workflows/architecture.yml
                </div>
                <pre className="mt-4 overflow-x-auto font-editorial-mono text-[0.71875rem] leading-[1.65] sm:text-xs">
{`- uses: AbdullahHakima/cqrslens@v0.8.0
  with:
    path: src
    strict: 'true'
    baseline: cqrslens-baseline.json
    comment-pr: 'true'
    annotations: 'true'
    sarif-output: cqrslens-results.sarif`}
                </pre>
              </div>
              <div className="min-w-0 p-4 sm:p-7 lg:col-span-5">
                <h3 className="m-0 font-editorial-sans text-lg font-medium text-[var(--color-text-primary)]">
                  Incremental Baselines &amp; Sticky PR Deltas
                </h3>
                <p className="mt-2.5 max-w-[30rem] font-editorial-sans text-sm leading-[1.6] text-[var(--color-text-secondary)]">
                  Record existing legacy debt once with{' '}
                  <code className="font-editorial-mono text-xs">--write-baseline</code>. Findings
                  match by{' '}
                  <code className="font-editorial-mono text-xs">rule + target + relative file</code>{' '}
                  rather than line number, so moving lines never triggers false alarms.
                </p>
                <p className="mt-3 mb-0 max-w-[30rem] font-editorial-sans text-sm leading-[1.6] text-[var(--color-text-secondary)]">
                  On pull requests, <code className="font-editorial-mono text-xs">--diff</code>{' '}
                  posts a Mermaid CQRS delta diagram of added, modified, and removed slices, and
                  exits with code <code className="font-editorial-mono text-xs">4</code> only on new
                  architecture errors.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
