/**
 * Editable Architectural Roadmap for Noctua / CqrsLens.
 *
 * Organized by engineering readiness horizon rather than speculative calendar dates.
 * Edit items or issue links here as priorities evolve on github.com/AbdullahHakima/cqrslens.
 */

export type RoadmapHorizon = 'shipped' | 'next' | 'exploring';

export interface RoadmapItem {
  id: string;
  horizon: RoadmapHorizon;
  area: 'Engine' | 'Rules' | 'Agents & IDE' | 'Messaging' | 'Visualization';
  title: string;
  summary: string;
  deliverable: string;
}

export const ROADMAP_ITEMS: readonly RoadmapItem[] = [
  // Shipped Foundation (v0.8.0 – v0.9.0)
  {
    id: 'flow-behavior-diagrams',
    horizon: 'shipped',
    area: 'Visualization',
    title: 'Endpoint Flow & Pipeline Behavior-Chain Diagrams',
    summary:
      'Markdown and HTML reports now draw endpoint → request → handler → DbContext flows plus a behavior-chain view in source scan order, with unresolved dispatches counted rather than guessed.',
    deliverable: 'Shipped in v0.9.0',
  },
  {
    id: 'standalone-svg-export',
    horizon: 'shipped',
    area: 'Visualization',
    title: 'Standalone SVG Export & Feature-Split CQRS Maps',
    summary:
      '`--export-svg <dir>` writes one complete .svg per diagram, while `--cqrs-map-split feature|unsplit|count` controls how large CQRS maps are divided.',
    deliverable: 'Shipped in v0.9.0',
  },
  {
    id: 'mcp-stdio-server',
    horizon: 'shipped',
    area: 'Agents & IDE',
    title: 'Built-in MCP Server & Token-Packed Agent Format',
    summary:
      'Live stdio Model Context Protocol server (`--mcp`) with 4 structural query tools plus `--format agent` single-file DNA export.',
    deliverable: 'Shipped in v0.8.0',
  },
  {
    id: 'zero-js-svg-html',
    horizon: 'shipped',
    area: 'Visualization',
    title: 'Zero-JS Offline SVG Architecture Explorer',
    summary:
      'Self-contained `ARCHITECTURE.html` (`--render svg`) that opens cleanly inside strict enterprise CI artifacts and air-gapped browsers.',
    deliverable: 'Shipped in v0.8.0',
  },
  {
    id: 'incremental-baselines-sarif',
    horizon: 'shipped',
    area: 'Rules',
    title: 'Line-Independent Legacy Baselines, PR Diffs & SARIF',
    summary:
      'Adopt `--strict` checks incrementally on legacy codebases via `--write-baseline`, sticky PR Mermaid delta diagrams, and GitHub Code Scanning SARIF.',
    deliverable: 'Shipped in v0.8.0',
  },

  // Next Horizon (Active Design & Implementation)
  {
    id: 'incremental-watch-daemon',
    horizon: 'next',
    area: 'Engine',
    title: 'Incremental File-Watcher & Live MCP Cache',
    summary:
      'Re-index only touched `.cs` and `.csproj` files on save so long-running MCP agent sessions and live HTML previews reflect edits instantaneously.',
    deliverable: '--watch flag & live MCP invalidation',
  },
  {
    id: 'distributed-messaging-bus',
    horizon: 'next',
    area: 'Messaging',
    title: 'MassTransit, NServiceBus & Azure Service Bus Topology',
    summary:
      'Extend slice cartography across process boundaries by linking `IPublishEndpoint.Publish<T>()` and outbox messages to `IConsumer<T>` / saga state machines.',
    deliverable: 'Cross-service message edges',
  },
  {
    id: 'endpoint-route-cartography',
    horizon: 'next',
    area: 'Engine',
    title: 'Deep ASP.NET Core Minimal API, Carter & Controller Route Extraction',
    summary:
      'Resolve route groups (`MapGroup("/api/v2")`), authorization policies, and HTTP verbs directly onto every CQRS dispatch call site.',
    deliverable: 'HTTP route + auth metadata in slices',
  },
  {
    id: 'modular-monolith-rules',
    horizon: 'next',
    area: 'Rules',
    title: 'Modular Monolith Cross-Module Boundary Rules',
    summary:
      'Enforce strict module encapsulation inside single-solution modular monoliths: forbid cross-module DbContext access or direct internal namespace imports.',
    deliverable: 'CrossModuleViolation & SharedDbSet rules',
  },

  // Exploring (Community Feedback & Research)
  {
    id: 'ide-inline-diagnostics',
    horizon: 'exploring',
    area: 'Agents & IDE',
    title: 'VS Code & JetBrains Rider Companion Extension',
    summary:
      'Click-to-navigate CodeLens above Commands and Queries showing linked Handler, Validator, touched DbSets, and inline rule diagnostics.',
    deliverable: 'IDE extension powered by cqrslens JSON/MCP',
  },
  {
    id: 'dapper-raw-sql-tables',
    horizon: 'exploring',
    area: 'Engine',
    title: 'Dapper & Raw SQL Read-Side Table Extraction',
    summary:
      'Many CQRS architectures use EF Core for Commands and Dapper SQL for Queries. Parse inline SQL / stored procedure names to keep entity blast-radius complete.',
    deliverable: 'Read-side SQL table links in trace_entity_impact',
  },
  {
    id: 'custom-architecture-policies',
    horizon: 'exploring',
    area: 'Rules',
    title: 'Declarative Custom Policy Expressions in `.cqrslens.json`',
    summary:
      'Allow platform teams to author organization-specific naming, namespace, and pipeline behavior rules without writing compiled C# test projects.',
    deliverable: 'Custom declarative rules schema',
  },
  {
    id: 'otel-runtime-overlay',
    horizon: 'exploring',
    area: 'Visualization',
    title: 'OpenTelemetry Runtime Latency & Throughput Overlay',
    summary:
      'Optional import of production OTel trace summaries onto the static SVG slice map to highlight hot queries, slow handlers, and truly dead endpoints.',
    deliverable: '--otel-overlay report enrichment',
  },
] as const;
