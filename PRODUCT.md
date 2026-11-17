# Product Context

## Product
- **Placeholder Brand Name:** `NOCTUA` (Centralized in `src/config/brand.ts` — `CqrsLens` is strictly the development/CLI package codename and repository slug, not the final brand identity).
- **Tagline:** Static architecture cartography for .NET & CQRS codebases.
- **Repository:** `https://github.com/AbdullahHakima/cqrslens`
- **Package / CLI (current technical artifact):** `dotnet tool install -g CqrsLens` (`v1.1.0` on NuGet).

## Audience
- Senior .NET backend engineers, software architects, tech leads inheriting unfamiliar MediatR / Mediator / Wolverine + Clean Architecture solutions, and engineering teams wiring AI coding agents (`--mcp`, `--format agent`) and strict CI architecture gates (`--strict`, `--diff`, SARIF).

## Core Value Proposition
1. **Zero-Build Static Analysis:** Reads `.csproj` and `.cs` source files directly without `dotnet restore` or `dotnet build` — mapping incomplete or broken solutions without waiting for a compiler.
2. **Full Vertical-Slice & Layer Cartography:** Maps Clean Architecture layers, project dependency graphs, endpoint → request → handler flows, per-request sequence diagrams, pipeline behavior chains (in registered order), Commands & Queries → Handlers → FluentValidation/FastEndpoints Validators → EF Core `DbContext` ER diagrams (including DI-resolved `IDbContext` abstractions and direct handler service calls) → Domain Event fan-out (`INotification` / `IDomainEvent`), and dispatch call sites.
3. **Canonical Offline Reports & AI Agent DNA:** Outputs `ARCHITECTURE.md` (Mermaid), zero-JS offline `ARCHITECTURE.html` (`--render svg`), deterministic `ARCHITECTURE.json` (including `resolvedEdges` and `serviceCallEdges`), `--slice` vertical traces, `--format agent`, standalone SVG/Mermaid diagrams (`--export-svg`, `--export-mermaid`), and a 7-tool read-only Model Context Protocol server (`--mcp`: `get_architecture_dna`, `trace_slice`, `trace_entity_impact`, `trace_request_impact`, `check_architecture`, `verify_claim`, `diff_architecture`).
4. **Deterministic CI Guardrails:** 11 architecture rules (`MissingHandler`, `MultipleHandlers`, `LayerViolation`, `ApplicationLayerViolation`, `CircularProjectDependency`, `CommandWithoutValidator`, `OrphanValidator`, `OrphanNotification`, `UnreachableRequest`, `UnpublishedNotification`, `AmbiguousProjectName`) with baselines, PR sticky diffs, and SARIF 2.1.0 export (`--sarif FILE`). Layer rules warn by default and become errors only when a layer model is asserted; explicit rule configuration always wins.

## Aesthetic & Brand Direction
- **Hero Centerpiece:** Real-time 3D WebGL sculptural **Owl** rendered through a custom 3-regime horizontal scanline + pixel-block halftone GLSL post-processing shader (inspired by Kate Loseva's *Pixel AI Agent Hero* editorial craft).
- **Why the Owl:** Sees the entire structural map silently in complete darkness without disturbing the codebase (zero-build static analysis), combining bird's-eye layer topology with pinpoint focus on a single vertical slice.
- **Visual Tone:** Tactile Swiss architectural monograph meets retro-digital bitmap printmaking. Warm drafting vellum paper, deep carbon ink, bespoke pixel display wordmarks, crisp monospace editorial copy, hairline structural drafting grids, and purposeful spring-driven motion. Zero generic SaaS gradients, zero Inter-everywhere defaults, zero nested card-in-card slop.
