import React from 'react';
import { BRAND } from '../config/brand';
import { Link } from '../lib/router';
import { PageMasthead } from '../components/layout/PageMasthead';
import { CodeBlock } from '../components/ui/CodeBlock';
import { ChevronRightIcon } from '../components/ui/Icons';

interface UseCaseBlueprint {
  id: string;
  title: string;
  persona: string;
  problem: string;
  outcome: string;
  commandLabel: string;
  commandSnippet: string;
  linkTo: string;
  linkLabel: string;
}

const USE_CASES: readonly UseCaseBlueprint[] = [
  {
    id: 'inherited-monorepo',
    title: 'Auditing an inherited or broken .NET monorepo on day one',
    persona: 'Principal Architects & Consulting Tech Leads',
    problem:
      'You clone a 50-project enterprise repository with private NuGet feeds, missing local certificates, and unconfigured connection strings. Running dotnet build fails immediately, leaving IDE diagramming tools and reflection tests completely dark.',
    outcome:
      'Generate a self-contained offline SVG explorer and full CQRS slice inventory directly from raw .csproj and .cs files—spotting cyclic project dependencies and layer leaks before configuring a single secret.',
    commandLabel: 'Day-1 Zero-Build Audit',
    commandSnippet: `# Works even when NuGet restore and dotnet build fail
${BRAND.cliBinary} . --format html --render svg -o ARCHITECTURE.html

# Inspect any suspicious request chain immediately
${BRAND.cliBinary} . --slice ProcessSettlementCommand`,
    linkTo: '/examples',
    linkLabel: 'See 47-project modular monolith map',
  },
  {
    id: 'ai-coding-agents',
    title: 'Replacing blind file-grepping in AI coding agents with live MCP DNA',
    persona: 'Teams Using Claude Code, Cursor, VS Code Copilot & Antigravity',
    problem:
      'When asked to modify a vertical slice, LLM coding agents spend thousands of tokens running sequential grep and file-read calls across Controllers, Application folders, Validators, and DbContexts—and frequently forget pipeline validators or domain event subscribers.',
    outcome:
      'Serving cqrslens over stdio (--mcp) gives the agent four deterministic structural tools. One trace_slice call returns exact File:Line coordinates for the entire chain, and check_architecture verifies all 11 static rules before the agent finishes its turn.',
    commandLabel: 'MCP Agent Loop',
    commandSnippet: `# Register stdio server once at repo root
claude mcp add cqrslens -- ${BRAND.cliBinary} . --mcp

# Agent workflow:
1. get_architecture_dna()          -> learns layers & conventions
2. trace_slice("CreateOrder")      -> gets exact File:Line slice map
3. check_architecture(strict=true) -> catches missing validator pre-commit`,
    linkTo: '/integrations',
    linkLabel: 'Copy editor MCP configurations',
  },
  {
    id: 'legacy-pr-guardrails',
    title: 'Stopping architectural drift in pull requests without a legacy rewrite',
    persona: 'Platform & Engineering Enablement Teams',
    problem:
      'Turning on strict architecture checks across a five-year-old solution surfaces dozens of historical warnings. Blocking merges until all legacy debt is repaid stalls product delivery, while ignoring warnings lets new layer violations slip in.',
    outcome:
      'Snapshot current debt once into a line-number-independent baseline. Every pull request receives a sticky Mermaid delta diagram of added or modified CQRS slices and fails with exit code 4 strictly when new unbaselined errors are introduced.',
    commandLabel: 'Incremental Baseline + PR Gate',
    commandSnippet: `# Commit existing findings once (matched by rule + contract + file, not line #)
${BRAND.cliBinary} src --write-baseline cqrslens-baseline.json

# Gate every PR without compiling
${BRAND.cliBinary} src --strict --baseline cqrslens-baseline.json`,
    linkTo: '/rules',
    linkLabel: 'Browse all 11 static rules',
  },
  {
    id: 'ef-core-blast-radius',
    title: 'Mapping EF Core entity blast radius prior to schema or module splits',
    persona: 'Staff Backend Engineers Extracting Bounded Contexts',
    problem:
      'Splitting a shared ShopDbContext.Orders table or extracting a Billing microservice requires knowing every Command that mutates the entity, every read-only Query projecting it, and every Domain Event triggered downstream.',
    outcome:
      'Static persistence modeling traces DbSet<T> accesses across handlers—separating write mutations from AsNoTracking() reads—so refactoring plans account for every affected vertical slice up front.',
    commandLabel: 'Entity Blast-Radius Inspection',
    commandSnippet: `# Via MCP tool trace_entity_impact("Orders") or JSON graph filter:
Entity: ShopDbContext.Orders
  Write Slices (3): CreateOrderCommand, CancelOrderCommand, ShipOrderCommand
  Read Slices  (2): GetOrderDetailsQuery [AsNoTracking], ExportOrdersQuery [AsNoTracking]
  Events       (2): OrderPlacedNotification, OrderShippedNotification`,
    linkTo: '/docs/output-formats',
    linkLabel: 'Explore JSON & ER schemas',
  },
];

export const UseCasesPage: React.FC = () => (
  <>
    <PageMasthead
      pixelLines={['USE CASES']}
      srTitle={`Use Cases & Engineering Workflows — ${BRAND.name}`}
      summary="Four concrete workflows where fast, compiler-free architectural cartography replaces manual diagramming, fragile reflection tests, and token-heavy LLM grepping."
      aside={
        <Link to="/quickstart" className="btn-primary">
          <span>Try on Your Repo</span>
          <ChevronRightIcon className="size-3.5" />
        </Link>
      }
    />

    <div className="divide-y divide-[var(--color-border-subtle)]">
      {USE_CASES.map((uc) => (
        <section
          key={uc.id}
          id={uc.id}
          aria-labelledby={`uc-heading-${uc.id}`}
          className="py-14 sm:py-18 md:py-22"
        >
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-12 lg:gap-14">
              <div className="min-w-0 lg:col-span-6">
                <h2
                  id={`uc-heading-${uc.id}`}
                  className="m-0 max-w-[28ch] text-[clamp(1.5rem,2.6vw,2.15rem)] font-medium tracking-[-0.025em] leading-[1.18] text-balance text-[var(--color-text-primary)]"
                >
                  {uc.title}
                </h2>

                <p className="mt-2.5 mb-0 font-editorial-mono text-xs text-[var(--color-text-muted)]">
                  {uc.persona}
                </p>

                <dl className="mt-6 space-y-4 border-t border-[var(--color-border-subtle)] pt-5">
                  <div>
                    <dt className="font-editorial-sans text-xs font-medium uppercase tracking-[0.04em] text-[var(--color-text-muted)]">
                      Friction Without Static Cartography
                    </dt>
                    <dd className="mt-1.5 mb-0 max-w-[36rem] font-editorial-sans text-[0.9375rem] leading-[1.6] text-pretty text-[var(--color-text-secondary)]">
                      {uc.problem}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-editorial-sans text-xs font-medium uppercase tracking-[0.04em] text-[var(--color-text-primary)]">
                      Deterministic Workflow
                    </dt>
                    <dd className="mt-1.5 mb-0 max-w-[36rem] font-editorial-sans text-[0.9375rem] leading-[1.6] text-pretty text-[var(--color-text-primary)]">
                      {uc.outcome}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <Link to={uc.linkTo} className="link-quiet">
                    <span>{uc.linkLabel}</span>
                    <ChevronRightIcon className="size-3.5" />
                  </Link>
                </div>
              </div>

              <div className="min-w-0 lg:col-span-6">
                <CodeBlock
                  label={uc.commandLabel}
                  code={uc.commandSnippet}
                  tone="inverse"
                />
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  </>
);

export default UseCasesPage;
