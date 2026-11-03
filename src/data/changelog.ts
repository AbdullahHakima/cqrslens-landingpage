/**
 * Editable Changelog Ledger for Noctua / CqrsLens CLI.
 *
 * Grounded in the tagged CqrsLens v0.9.0 CHANGELOG and its historical releases.
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
    version: '0.9.0',
    dateLabel: '2026-11-02',
    isLatest: true,
    headline: 'Flow Diagrams, Behavior Chains & Standalone SVG Export',
    summary:
      'The reporting release: flow and behavior-chain diagrams now visualize dispatch data the scanner already collected, CQRS maps can be split by feature or project, and every diagram can be exported as its own SVG. JSON output is unchanged from 0.8.0.',
    changes: [
      {
        tag: 'ADDED',
        category: 'Outputs',
        text: 'Endpoint → request → handler → DbContext flow diagrams in Markdown and HTML, rendered as Mermaid or inline SVG. Unresolved dispatches are counted in the caption, never drawn as guessed edges.',
      },
      {
        tag: 'ADDED',
        category: 'Outputs',
        text: 'Pipeline behavior-chain visual showing the behaviors around a request in the order they were found in source.',
      },
      {
        tag: 'ADDED',
        category: 'Outputs',
        text: 'CQRS map splitting via `--cqrs-map-split count|feature|unsplit` or the `cqrsMapSplit` config key. The flag overrides the config file; unknown values fail with an error.',
      },
      {
        tag: 'ADDED',
        category: 'Outputs',
        text: 'Standalone SVG export with `--export-svg <directory>`: one complete .svg per diagram, additive to the primary report, with no PNG output.',
      },
      {
        tag: 'IMPROVED',
        category: 'Outputs',
        text: 'Report diagrams now carry captions explaining what to look at, and labels use full request and handler names instead of shortened forms.',
      },
    ],
  },
  {
    version: '0.8.0',
    dateLabel: '2026-10-31',
    headline: 'MCP Server, Reachability Checks & Deep Vertical-Slice Tracing',
    summary:
      'First NuGet release since 0.6.0, including the 0.7.0 diff work. Adds a live Model Context Protocol server, dispatch call-site tracking, notifications, reachability checks, deep slice tracing, and a token-packed agent report.',
    changes: [
      {
        tag: 'ADDED',
        category: 'MCP',
        text: 'Built-in MCP server (`cqrslens <path> --mcp`) speaking JSON-RPC 2.0 over stdio with `get_architecture_dna`, `trace_slice`, `trace_entity_impact`, and `check_architecture`.',
      },
      {
        tag: 'ADDED',
        category: 'Rules',
        text: '`UnreachableRequest` and `UnpublishedNotification` warning checks backed by production `Send()` and `Publish()` call-site tracking. Test-project dispatches do not count as reachable.',
      },
      {
        tag: 'ADDED',
        category: 'Outputs',
        text: 'Deep vertical-slice tracing across controllers, minimal APIs, and FastEndpoints, plus token-packed `--format agent` output for LLM context windows.',
      },
      {
        tag: 'ADDED',
        category: 'Outputs',
        text: 'Notification and domain-event discovery with fan-out diagrams, expanded rules, and an interactive HTML CQRS explorer with per-request inspector cards.',
      },
      {
        tag: 'IMPROVED',
        category: 'Engine',
        text: 'Added per-phase profiling and shared source workspaces, reduced synthetic-scan memory and time through source masking and prechecks, and hardened long-line handling.',
      },
      {
        tag: 'FIXED',
        category: 'Rules',
        text: 'Open-generic request wrappers no longer produce false MultipleHandlers errors, OrphanValidator no longer fires without a CQRS request model, and guessed layer models now produce warnings instead of errors.',
      },
    ],
  },
  {
    version: '0.7.0',
    dateLabel: '2026-10-25',
    headline: 'Architecture Diffing, Sticky PR Diffs & Mediator/Wolverine Conventions',
    summary:
      'Adds report-to-report architecture diffing, a GitHub Action that posts a sticky pull-request comment, and automatic conventions for martinothamar/Mediator and Wolverine.',
    changes: [
      {
        tag: 'ADDED',
        category: 'CI',
        text: 'Architecture diffing via `--diff <PATH_OR_JSON>` and `--diff-output`, tracking project, request, handler, validator, behavior, DbContext, and finding changes.',
      },
      {
        tag: 'ADDED',
        category: 'CI',
        text: 'GitHub Action pull-request comments with `comment-pr`, `diff-base`, `diff-output`, and `github-token` inputs, plus automatic base-branch worktree comparison.',
      },
      {
        tag: 'ADDED',
        category: 'Engine',
        text: 'Automatic martinothamar/Mediator conventions for `ICommand`, `IQuery`, `IStream*` requests and their handlers, without custom markers.',
      },
      {
        tag: 'ADDED',
        category: 'Engine',
        text: 'Wolverine conventions for `*Handler` and `*Consumer` classes with `Handle`, `HandleAsync`, `Consume`, or `ConsumeAsync` methods.',
      },
      {
        tag: 'IMPROVED',
        category: 'Outputs',
        text: 'Detected conventions are listed in the Markdown report header and the JSON `conventions` field.',
      },
    ],
  },
  {
    version: '0.6.0',
    dateLabel: '2026-10-25',
    headline: 'EF Core ER Diagrams, Pre-rendered SVG & Deterministic JSON',
    summary:
      'Adds first-class EF Core entity-relationship modeling, zero-JavaScript inline SVG reports, schema-versioned JSON output, and console artwork with watermarks.',
    changes: [
      {
        tag: 'ADDED',
        category: 'Outputs',
        text: 'EF Core `DbContext` ER diagrams derived from `DbSet<T>` roots, navigation properties, data annotations, and Fluent API configuration.',
      },
      {
        tag: 'ADDED',
        category: 'Outputs',
        text: 'Pre-rendered SVG diagrams with `--render svg` for offline HTML reports with no browser-side Mermaid dependency.',
      },
      {
        tag: 'ADDED',
        category: 'Outputs',
        text: 'Schema-versioned `--format json` output covering projects, requests, handlers, validators, behaviors, DbContexts, findings, and diagnostics.',
      },
      {
        tag: 'ADDED',
        category: 'Outputs',
        text: 'Console ASCII artwork, TrueColor gradients, progress, and custom watermarks for terminal, Markdown, HTML, and JSON output.',
      },
      {
        tag: 'IMPROVED',
        category: 'Engine',
        text: 'Expanded MSBuild `<Using>` evaluation, per-project global using scopes, and Roslyn base-class/generic-response propagation.',
      },
    ],
  },
  {
    version: '0.5.0',
    dateLabel: '2026-10-22',
    headline: 'FastEndpoints Validators, External Handler Wrappers & Module-Aware Linking',
    summary:
      'Broadens convention coverage to FastEndpoints validators and package-supplied handler wrappers, and resolves same-named contracts through namespaces and using directives.',
    changes: [
      {
        tag: 'ADDED',
        category: 'Engine',
        text: 'FastEndpoints `Validator<T>` roots are linked to CQRS requests, avoiding false CommandWithoutValidator warnings.',
      },
      {
        tag: 'ADDED',
        category: 'Engine',
        text: 'External handler wrappers via `--handler-markers` and the `handlerMarkers` config key for interfaces supplied by packages.',
      },
      {
        tag: 'ADDED',
        category: 'Engine',
        text: 'Module-aware contract resolution through namespaces, global usings, and aliases, with genuine ambiguity reported as a diagnostic.',
      },
      {
        tag: 'ADDED',
        category: 'Engine',
        text: 'Source-declared request base classes such as `CommandBase` and `QueryBase<T>` are followed transitively with generic response substitution.',
      },
      {
        tag: 'IMPROVED',
        category: 'Engine',
        text: 'The public validation corpus records request and handler roots separately; the ardalis row links 23/23 handlers and recognizes 21 FastEndpoints validators while retaining 13 genuine warnings.',
      },
    ],
  },
  {
    version: '0.4.0',
    dateLabel: '2026-10-22',
    headline: 'Project Configuration, Baselines & CI-Native Outputs',
    summary:
      'Makes CqrsLens practical in existing repositories with `.cqrslens.json`, line-independent baselines, SARIF and job summaries, and broader runtime compatibility.',
    changes: [
      {
        tag: 'ADDED',
        category: 'Engine',
        text: '`.cqrslens.json` configuration for analysis mode, custom markers, source include/exclude globs, project layers, and per-rule severities. Unknown keys and invalid values are usage errors.',
      },
      {
        tag: 'ADDED',
        category: 'CI',
        text: '`--write-baseline` and `--baseline` match findings by rule, target identity, and root-relative file, so `--strict` fails only on new errors.',
      },
      {
        tag: 'ADDED',
        category: 'CI',
        text: 'SARIF 2.1.0, Markdown job summaries, GitHub annotations, and `--ci-root` path rebasing for subfolder scans.',
      },
      {
        tag: 'ADDED',
        category: 'CI',
        text: 'The composite Action exposes config, baseline, SARIF, and annotation inputs; CI verifies the installed package on .NET 8, 9, and 10.',
      },
      {
        tag: 'ADDED',
        category: 'Engine',
        text: 'A pinned public validation corpus with local runner and non-blocking report workflow, documented as informational rather than a release gate.',
      },
    ],
  },
  {
    version: '0.1.0',
    dateLabel: '2026-10-21',
    headline: 'Zero-Build .NET Project Graph & ARCHITECTURE.md Mermaid Generator',
    summary:
      'First NuGet global tool release scanning `.csproj` and `.cs` files directly to emit Markdown architecture maps.',
    changes: [
      {
        tag: 'ADDED',
        category: 'Outputs',
        text: 'Single-command `ARCHITECTURE.md` generation with Mermaid project dependency DAGs and CQRS request/handler/validator tables.',
      },
      {
        tag: 'ADDED',
        category: 'Engine',
        text: 'MediatR request and handler discovery, FluentValidation links, pipeline behavior detection, and DbContext/DbSet inventory.',
      },
      {
        tag: 'ADDED',
        category: 'Rules',
        text: 'Core architecture checks for missing handlers, layer violations, and commands without validators, with `--strict` failing on errors.',
      },
    ],
  },
] as const;
