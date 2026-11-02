import { BRAND } from './brand';

export interface RouteMeta {
  path: string;
  label: string;
  title: string;
  description: string;
  showInHeader?: boolean;
}

export const ROUTES: readonly RouteMeta[] = [
  {
    path: '/',
    label: 'Home',
    title: `${BRAND.name} — Static .NET & CQRS Architecture Cartography`,
    description:
      'Map any MediatR, Mediator, or Wolverine .NET solution in milliseconds without building it. Generates ARCHITECTURE.md diagrams, interactive offline HTML explorers, CI guardrails, and MCP context for coding agents.',
  },
  {
    path: '/quickstart',
    label: 'Quickstart',
    title: `Quickstart — ${BRAND.name} (.NET CLI & MCP Setup)`,
    description:
      'Install CqrsLens and generate your first .NET Clean Architecture & CQRS map, GitHub Actions PR gate, or MCP coding agent server in under 60 seconds.',
  },
  {
    path: '/features',
    label: 'Features',
    title: `Features & Comparison — ${BRAND.name}`,
    description:
      'Explore zero-build text and Roslyn static engines, vertical-slice and EF Core DbContext cartography, deterministic SVG/Mermaid/SARIF outputs, and comparisons with NetArchTest, ArchUnitNET, and NDepend.',
    showInHeader: true,
  },
  {
    path: '/use-cases',
    label: 'Use Cases',
    title: `Use Cases — ${BRAND.name} Architecture Workflows`,
    description:
      'Concrete workflows for auditing inherited .NET monorepos, grounding AI coding agents over MCP, enforcing Clean Architecture in pull requests, and tracing EF Core entity blast radius.',
    showInHeader: true,
  },
  {
    path: '/docs',
    label: 'Docs',
    title: `Documentation & CLI Reference — ${BRAND.name}`,
    description:
      'Complete technical manual for the cqrslens CLI: command-line flags, .cqrslens.json rule configuration, output schemas, dual analysis engines, and deterministic CI exit codes.',
    showInHeader: true,
  },
  {
    path: '/rules',
    label: 'Rules',
    title: `Static Architecture Rules Catalog — ${BRAND.name}`,
    description:
      'Reference specification for all 11 static CQRS and Clean Architecture checks, including default severities, .cqrslens.json overrides, and C# violation vs. fix examples.',
    showInHeader: true,
  },
  {
    path: '/integrations',
    label: 'Integrations',
    title: `MCP Agents & CI/CD Integrations — ${BRAND.name}`,
    description:
      'Copy-paste configurations for Claude Code, Cursor, VS Code, Antigravity MCP servers, GitHub Actions sticky PR diffs, SARIF code scanning, Azure DevOps, and GitLab CI.',
    showInHeader: true,
  },
  {
    path: '/examples',
    label: 'Examples',
    title: `Sample Architecture Reports — ${BRAND.name}`,
    description:
      'Inspect real static architecture maps, SVG dependency graphs, and vertical-slice traces generated from jasontaylordev, ardalis, kgrzybek, and martinothamar open-source .NET repositories.',
    showInHeader: true,
  },
  {
    path: '/changelog',
    label: 'Changelog',
    title: `Changelog — ${BRAND.name} (${BRAND.nugetPackage} Releases)`,
    description:
      'Chronological release notes across CqrsLens CLI engines, static architecture checks, offline SVG reports, SARIF baselines, and Model Context Protocol tools.',
    showInHeader: true,
  },
  {
    path: '/roadmap',
    label: 'Roadmap',
    title: `Roadmap — ${BRAND.name} Architecture Direction`,
    description:
      'Upcoming capabilities in active design and exploration: incremental watch mode, MassTransit/NServiceBus message tracing, Modular Monolith boundary checks, and community requests.',
    showInHeader: true,
  },
] as const;

export const DOC_SECTION_ROUTES: ReadonlyArray<{
  slug: string;
  title: string;
  description: string;
}> = [
  {
    slug: 'overview',
    title: `Overview & Concepts — ${BRAND.name} Docs`,
    description:
      'How static compiler-free .NET cartography works across Clean Architecture layers, CQRS vertical slices, and EF Core DbContexts.',
  },
  {
    slug: 'installation',
    title: `Installation & Requirements — ${BRAND.name} Docs`,
    description:
      'Install CqrsLens globally or as a local .NET 8+ tool manifest (.config/dotnet-tools.json) for reproducible team and CI builds.',
  },
  {
    slug: 'cli-reference',
    title: `CLI Flags & Arguments — ${BRAND.name} Docs`,
    description:
      'Complete reference for cqrslens command-line options: --format, --render, --slice, --analysis, --strict, --diff, --baseline, and --mcp.',
  },
  {
    slug: 'configuration',
    title: `.cqrslens.json Configuration — ${BRAND.name} Docs`,
    description:
      'Configure rule severities, custom CQRS marker interfaces, excluded project globs, and baseline paths in .cqrslens.json.',
  },
  {
    slug: 'output-formats',
    title: `Output Formats & Schemas — ${BRAND.name} Docs`,
    description:
      'Detailed specification for ARCHITECTURE.md (Mermaid), zero-JS ARCHITECTURE.html (--render svg), ARCHITECTURE.json, agent DNA, and SARIF 2.1.0.',
  },
  {
    slug: 'analysis-engines',
    title: `Text vs. Roslyn Scanners — ${BRAND.name} Docs`,
    description:
      'Architectural comparison between the default ultra-fast text scanner (--analysis text) and no-build Roslyn syntax/symbol scanner (--analysis roslyn).',
  },
  {
    slug: 'exit-codes',
    title: `Exit Codes & Baselines — ${BRAND.name} Docs`,
    description:
      'Deterministic CLI exit codes (0–4), line-number-independent baseline matching, and CI failure semantics.',
  },
  {
    slug: 'troubleshooting',
    title: `Troubleshooting & FAQ — ${BRAND.name} Docs`,
    description:
      'Resolving custom mediator wrapper types, ambiguous project names, monorepo path scoping, and MCP stdio path issues.',
  },
];

export function resolveRouteMeta(pathname: string): {
  title: string;
  description: string;
  canonicalPath: string;
} {
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');

  if (normalized.startsWith('/docs/')) {
    const slug = normalized.slice('/docs/'.length);
    const docMatch = DOC_SECTION_ROUTES.find((d) => d.slug === slug);
    if (docMatch) {
      return {
        title: docMatch.title,
        description: docMatch.description,
        canonicalPath: `/docs/${docMatch.slug}`,
      };
    }
  }

  const exact = ROUTES.find((r) => r.path === normalized);
  if (exact) {
    return {
      title: exact.title,
      description: exact.description,
      canonicalPath: exact.path,
    };
  }

  return {
    title: `Page Not Found — ${BRAND.name}`,
    description: BRAND.heroSummary,
    canonicalPath: normalized || '/',
  };
}
