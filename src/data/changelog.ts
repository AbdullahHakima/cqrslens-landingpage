/**
 * Editable Changelog Ledger for Noctua / CqrsLens CLI.
 *
 * Grounded in verified CqrsLens v0.8.0 capabilities.
 * Update release dates or historical version groupings below to match exact GitHub tags.
 */

export type ChangeCategory = 'Engine' | 'Rules' | 'MCP' | 'Outputs' | 'CI';

export interface ChangelogItem {
  tag: 'ADDED' | 'IMPROVED' | 'FIXED';
  category: ChangeCategory;
  text: string;
}

export interface ReleaseEntry {
  version: string;
  /** Editable label or ISO date string — marked clearly when milestone-based */
  dateLabel: string;
  isLatest?: boolean;
  headline: string;
  summary: string;
  changes: readonly ChangelogItem[];
}

export const CHANGELOG_RELEASES: readonly ReleaseEntry[] = [
  {
    version: '0.8.0',
    dateLabel: 'Current Release · NuGet v0.8.0',
    isLatest: true,
    headline: 'MCP Agent Server, Zero-JS SVG Explorer & 11-Rule Strict CI Gates',
    summary:
      'Brings live Model Context Protocol stdio tooling for AI coding agents, compiled zero-JavaScript SVG HTML reports, line-independent legacy baselines, and full text/Roslyn parity across 105 public corpus projects.',
    changes: [
      {
        tag: 'ADDED',
        category: 'MCP',
        text: 'Built-in MCP server (`cqrslens <path> --mcp`) exposing `get_architecture_dna`, `trace_slice`, `trace_entity_impact`, and `check_architecture` over stdio.',
      },
      {
        tag: 'ADDED',
        category: 'Outputs',
        text: 'Token-packed `--format agent` (`ARCHITECTURE.agent.md`) output designed for single-shot LLM context windows.',
      },
      {
        tag: 'ADDED',
        category: 'Outputs',
        text: 'Offline zero-JS HTML report compilation (`--format html --render svg`) embedding pre-laid-out Clean Architecture and CQRS SVG graphs.',
      },
      {
        tag: 'ADDED',
        category: 'CI',
        text: 'Pull request architectural delta mode (`--diff`) with sticky PR Mermaid summaries, SARIF 2.1.0 export, and `--write-baseline` support.',
      },
      {
        tag: 'IMPROVED',
        category: 'Engine',
        text: 'Achieved 100% contract-linking parity between `--analysis text` (10.4 ms warm on SampleShop) and `--analysis roslyn` (28.9 ms warm without build).',
      },
      {
        tag: 'FIXED',
        category: 'Engine',
        text: 'Namespace and generic arity disambiguation when two bounded contexts declare identically named commands (e.g. `TogglePostLikeCommand`).',
      },
    ],
  },
  {
    version: '0.7.0',
    dateLabel: 'Milestone Release · v0.7',
    headline: 'Vertical-Slice Tracer (`--slice`) & EF Core DbContext ER Modeling',
    summary:
      'Expanded static analysis beyond request-to-handler edges to trace full vertical slices from endpoint dispatch down to EF Core DbSet touches and domain event fan-out.',
    changes: [
      {
        tag: 'ADDED',
        category: 'Outputs',
        text: 'Targeted vertical-slice query mode (`--slice <name>`) printing dispatch file:line, validator, pipeline behaviors, handler, DbSets, and notifications.',
      },
      {
        tag: 'ADDED',
        category: 'Engine',
        text: 'Static EF Core `DbContext` entity-relationship extraction from `DbSet<T>` properties, data annotations, and `OnModelCreating` Fluent API configurations.',
      },
      {
        tag: 'ADDED',
        category: 'Rules',
        text: 'Reachability checks `UnreachableRequest`, `OrphanNotification`, and `UnpublishedNotification` backed by `Send()` and `Publish()` call-site tracking.',
      },
      {
        tag: 'IMPROVED',
        category: 'Engine',
        text: 'Read-only `AsNoTracking()` query detection on `DbSet<T>` accesses inside query handlers.',
      },
    ],
  },
  {
    version: '0.6.0',
    dateLabel: 'Milestone Release · v0.6',
    headline: 'Multi-Mediator Support (Mediator & Wolverine) + `.cqrslens.json`',
    summary:
      'Generalized CQRS contract discovery beyond MediatR to support source-generated Mediator, Wolverine conventions, FastEndpoints validators, and per-repo rule configuration.',
    changes: [
      {
        tag: 'ADDED',
        category: 'Engine',
        text: 'Automatic convention detection for `martinothamar/Mediator`, `Wolverine` message handlers, `FastEndpoints` validators, and custom marker interface hierarchies.',
      },
      {
        tag: 'ADDED',
        category: 'Rules',
        text: 'Repository-level `.cqrslens.json` configuration to tune each rule between `error`, `warning`, and `off`, plus custom ignore globs.',
      },
      {
        tag: 'ADDED',
        category: 'Outputs',
        text: 'Deterministic schema-versioned `ARCHITECTURE.json` output for custom internal developer portals and CI scripts.',
      },
    ],
  },
  {
    version: '0.5.0',
    dateLabel: 'Milestone Release · v0.5',
    headline: 'No-Build Roslyn Backend & Nightly Public Corpus Suite',
    summary:
      'Introduced the optional Roslyn syntax/symbol backend alongside the ultra-fast parallel text scanner, verified nightly against canonical open-source Clean Architecture solutions.',
    changes: [
      {
        tag: 'ADDED',
        category: 'Engine',
        text: 'Dual-backend `--analysis text|roslyn` flag allowing symbol-tree verification without running `dotnet restore` or `dotnet build`.',
      },
      {
        tag: 'ADDED',
        category: 'Rules',
        text: 'Clean Architecture structural checks: `LayerViolation`, `ApplicationLayerViolation`, `CircularProjectDependency`, and `AmbiguousProjectName`.',
      },
      {
        tag: 'IMPROVED',
        category: 'Engine',
        text: 'MSBuild `<Using>` item, `global using`, type alias, and base-class generic response substitution support.',
      },
    ],
  },
  {
    version: '0.4.0',
    dateLabel: 'Initial Public Foundation · v0.4',
    headline: 'Zero-Build .NET Project Graph & ARCHITECTURE.md Mermaid Generator',
    summary:
      'First NuGet global tool release scanning `.csproj` and `.cs` files directly to emit deterministic Markdown architecture maps.',
    changes: [
      {
        tag: 'ADDED',
        category: 'Outputs',
        text: 'Single-command `ARCHITECTURE.md` generation with Mermaid project dependency DAGs and CQRS request/handler/validator tables.',
      },
      {
        tag: 'ADDED',
        category: 'Rules',
        text: 'Core CQRS hygiene rules: `MissingHandler`, `MultipleHandlers`, `CommandWithoutValidator`, and `OrphanValidator`.',
      },
    ],
  },
] as const;
