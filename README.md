# Noctua — Multi-Page Website & Interactive Architecture Explorer

Built from scratch with **Vite 6**, **React 19**, **TypeScript 5.8**, **Tailwind CSS v4**, **Three.js (WebGL2 + custom GLSL post-processing)**, **UI Skills**, and **Impeccable**.

## Placeholder Brand Identity Seam

`CqrsLens` / `cqrslens` is the active NuGet package and CLI development codename (`https://github.com/AbdullahHakima/cqrslens`). The visual brand identity uses **`Noctua`** (*Athene noctua* — Little Owl) as a clean placeholder paired with the real-time 3D Owl hero centerpiece.

To update the final product name across the stepped-pixel wordmarks, navigation, metadata, and colophon, edit **`src/config/brand.ts`**.

## Multi-Page Routes & Editable Content Modules

Every route ships both client-side navigation and build-time static HTML entry points (`dist/<route>.html` + `dist/<route>/index.html` + `dist/404.html`) with route-specific Open Graph and canonical metadata:

- `/` — Flagship landing page with real-time 3D WebGL Owl hero, interactive workbench, 6-stage pipeline, check preview, and corpus benchmarks (`src/pages/HomePage.tsx`)
- `/quickstart` — Interactive 60-second stack configurator for local maps, MCP agents, and CI gates (`src/pages/QuickstartPage.tsx`)
- `/features` — Vertical-slice & EF Core cartography, 5 deterministic output formats, and tool comparison matrix vs. NetArchTest / ArchUnitNET / Roslyn / NDepend (`src/pages/FeaturesPage.tsx`)
- `/use-cases` — Four scenario blueprints for inherited monorepos, AI coding agents, incremental PR baselines, and EF Core blast radius (`src/pages/UseCasesPage.tsx`)
- `/docs` & `/docs/:section` — Technical reference manual with sticky chapter rail, parameter tables, `.cqrslens.json` schema, and exit codes (`src/pages/DocsPage.tsx`, `src/data/docs.ts`)
- `/rules` — Searchable 11-rule static checks catalog with `#RuleId` SARIF anchors and C# violation vs. clean resolution examples (`src/pages/RulesPage.tsx`, `src/data/rules.ts`)
- `/integrations` — Copy-paste setups for Claude Code, Cursor, VS Code Copilot, Antigravity MCP servers, GitHub Actions, Azure DevOps, and GitLab CI (`src/pages/IntegrationsPage.tsx`, `src/data/integrations.ts`)
- `/examples` — Inspectable generated topologies and vertical-slice traces from `jasontaylordev`, `kgrzybek`, `ardalis`, and `martinothamar` public repositories (`src/pages/ExamplesPage.tsx`, `src/data/examples.ts`)
- `/changelog` — Chronological release ledger with subsystem filters (`src/pages/ChangelogPage.tsx`, `src/data/changelog.ts`)
- `/roadmap` — Readiness-horizon roadmap wired to GitHub Issues (`src/pages/RoadmapPage.tsx`, `src/data/roadmap.ts`)

## Commands

```bash
pnpm dev           # Start local Vite dev server
pnpm build         # Run strict tsc + production multi-page static bundle
pnpm preview       # Preview static production build
pnpm check:design  # Run Impeccable deterministic UI detector
```
