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
    deliverable: 'Shipped in v0.6.0',
  },
  {
    id: 'incremental-baselines-sarif',
    horizon: 'shipped',
    area: 'Rules',
    title: 'Line-Independent Legacy Baselines, PR Diffs & SARIF',
    summary:
      'Adopt `--strict` checks incrementally on legacy codebases via `--write-baseline` and `--baseline` (v0.4.0), sticky PR architecture diff comments (v0.7.0), and GitHub Code Scanning SARIF (v0.4.0).',
    deliverable: 'Shipped in v0.4.0 – v0.7.0',
  },

  // Ideas, not planned yet — mirrors the "Ideas, not planned yet" section of
  // ROADMAP.md in the CqrsLens repository. Nothing here is scheduled or promised.
  {
    id: 'fsharp-project-support',
    horizon: 'exploring',
    area: 'Engine',
    title: 'F# Project Support',
    summary:
      'The one idea recorded in the project roadmap today: extend static cartography beyond C# to F# projects. Not planned yet — no design, no schedule.',
    deliverable: 'Idea — not planned yet',
  },
] as const;
