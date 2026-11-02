import React, { useMemo, useState } from 'react';
import { BRAND } from '../config/brand';
import { Link } from '../lib/router';
import { PageMasthead } from '../components/layout/PageMasthead';
import { CodeBlock } from '../components/ui/CodeBlock';
import { InstallCommandButton } from '../components/ui/InstallCommandButton';
import { ChevronRightIcon } from '../components/ui/Icons';

type MediatorChoice = 'mediatr' | 'mediator' | 'wolverine' | 'custom';
type WorkflowChoice = 'local-map' | 'mcp-agent' | 'ci-gate';
type ValidationChoice = 'fluentvalidation' | 'fastendpoints' | 'none';

const MEDIATOR_OPTIONS: ReadonlyArray<{
  id: MediatorChoice;
  label: string;
  detail: string;
}> = [
  {
    id: 'mediatr',
    label: 'MediatR',
    detail: 'IRequest<T>, IRequestHandler<T, R>, INotification, IPipelineBehavior',
  },
  {
    id: 'mediator',
    label: 'martinothamar/Mediator',
    detail: 'Source-generated ICommand<T>, IQuery<T>, ValueTask handlers',
  },
  {
    id: 'wolverine',
    label: 'Wolverine',
    detail: 'Convention-based Handle() / Consume() methods & message cascading',
  },
  {
    id: 'custom',
    label: 'Custom CQRS Markers',
    detail: 'In-house ICommand<T> / IQueryHandler<T, R> wrapper interfaces',
  },
];

const WORKFLOW_OPTIONS: ReadonlyArray<{
  id: WorkflowChoice;
  label: string;
  detail: string;
}> = [
  {
    id: 'local-map',
    label: 'Local SVG & Markdown Map',
    detail: 'Generate ARCHITECTURE.md and offline zero-JS ARCHITECTURE.html',
  },
  {
    id: 'mcp-agent',
    label: 'AI Coding Agent (MCP)',
    detail: 'Connect Claude Code, Cursor, VS Code, or Antigravity over stdio',
  },
  {
    id: 'ci-gate',
    label: 'Pull Request CI Gate',
    detail: 'Snapshot legacy baseline and block new drift with --strict',
  },
];

const VALIDATION_OPTIONS: ReadonlyArray<{
  id: ValidationChoice;
  label: string;
}> = [
  { id: 'fluentvalidation', label: 'FluentValidation' },
  { id: 'fastendpoints', label: 'FastEndpoints' },
  { id: 'none', label: 'Domain-only / No Validator Lib' },
];

export const QuickstartPage: React.FC = () => {
  const [mediator, setMediator] = useState<MediatorChoice>('mediatr');
  const [workflow, setWorkflow] = useState<WorkflowChoice>('local-map');
  const [validation, setValidation] = useState<ValidationChoice>('fluentvalidation');

  const generated = useMemo(() => {
    const needsConfig = mediator === 'custom' || validation === 'none';

    const configJson = `{
  "excludeProjects": ["**/*.Tests.csproj", "**/*.Benchmarks.csproj"],${
    mediator === 'custom'
      ? `
  "customMarkers": {
    "commands": ["ICommand", "ICommand<>"],
    "queries": ["IQuery<>"],
    "handlers": ["ICommandHandler<>", "ICommandHandler<,>", "IQueryHandler<,>"],
    "events": ["IDomainEvent"]
  },`
      : ''
  }
  "rules": {
    "MissingHandler": "error",
    "LayerViolation": "error",
    "ApplicationLayerViolation": "error",
    "CommandWithoutValidator": "${validation === 'none' ? 'off' : 'warning'}"
  }
}`;

    if (workflow === 'local-map') {
      return {
        primaryLabel: 'Terminal · Map Your Solution in ~15 ms',
        primaryCode: `# 1. Install global .NET 8+ tool once
${BRAND.installCommand}

# 2. Navigate to your .NET solution root (no dotnet build needed)
cd /path/to/your-solution

# 3. Emit ARCHITECTURE.md (Mermaid) + offline zero-JS ARCHITECTURE.html
${BRAND.cliBinary} .
${BRAND.cliBinary} . --format html --render svg -o ARCHITECTURE.html

# 4. Inspect a single vertical slice end-to-end
${BRAND.cliBinary} . --slice CreateOrder`,
        secondaryLabel: needsConfig
          ? '.cqrslens.json (Recommended for your selection)'
          : 'Expected Console Summary',
        secondaryCode: needsConfig
          ? configJson
          : `Architecture Summary (${
              MEDIATOR_OPTIONS.find((m) => m.id === mediator)?.label
            } auto-detected)
------------------------------------------------------
Scanner / Timing      text · 14 ms · zero MSBuild calls
Artifacts Written     ARCHITECTURE.md, ARCHITECTURE.html (inline SVG)
Checks Evaluated      11 static rules (exit code 0)`,
      };
    }

    if (workflow === 'mcp-agent') {
      return {
        primaryLabel: 'Terminal & MCP Registration',
        primaryCode: `# 1. Ensure ${BRAND.cliBinary} is on your global PATH
${BRAND.installCommand}

# 2a. Claude Code one-liner (run inside your .NET repo):
claude mcp add cqrslens -- ${BRAND.cliBinary} . --mcp

# 2b. Or add to .cursor/mcp.json / mcp_config.json:
{
  "mcpServers": {
    "cqrslens": {
      "command": "${BRAND.cliBinary}",
      "args": [".", "--mcp"]
    }
  }
}`,
        secondaryLabel: needsConfig
          ? '.cqrslens.json (Place at repo root)'
          : 'First Prompt to Verify Your Agent Connection',
        secondaryCode: needsConfig
          ? configJson
          : `"Call get_architecture_dna to summarize our Clean Architecture layers, then call trace_slice on our primary write command and run check_architecture."`,
      };
    }

    return {
      primaryLabel: 'Incremental Baseline + Strict PR Gate',
      primaryCode: `# 1. Pin ${BRAND.nugetPackage} in your repo tool manifest
dotnet new tool-manifest
dotnet tool install ${BRAND.nugetPackage} --version ${BRAND.version}

# 2. Freeze existing legacy findings once (line-number independent)
dotnet ${BRAND.cliBinary} src --write-baseline cqrslens-baseline.json
git add .config/dotnet-tools.json cqrslens-baseline.json

# 3. Run strict check locally or in CI (exits 4 only on NEW errors)
dotnet ${BRAND.cliBinary} src --strict --baseline cqrslens-baseline.json --diff origin/main`,
      secondaryLabel: needsConfig
        ? '.cqrslens.json (Commit alongside baseline)'
        : '.github/workflows/architecture.yml',
      secondaryCode: needsConfig
        ? configJson
        : `- uses: AbdullahHakima/cqrslens@v${BRAND.version}
  with:
    path: src
    strict: 'true'
    baseline: cqrslens-baseline.json
    comment-pr: 'true'
    sarif-output: cqrslens-results.sarif`,
    };
  }, [mediator, validation, workflow]);

  return (
    <>
      <PageMasthead
        pixelLines={['QUICKSTART']}
        srTitle={`Quickstart — Start mapping your .NET architecture with ${BRAND.name}`}
        summary="Go from a fresh terminal to a complete Clean Architecture & CQRS map, live MCP coding-agent server, or strict pull-request guardrail in under sixty seconds—without compiling your solution."
        aside={<InstallCommandButton />}
      />

      {/* Interactive Setup Configurator */}
      <section
        aria-labelledby="configurator-heading"
        className="border-b border-[var(--color-border-subtle)] py-14 sm:py-18 md:py-22"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <div className="max-w-[36rem]">
            <h2
              id="configurator-heading"
              className="m-0 text-[clamp(1.6rem,2.8vw,2.25rem)] font-medium tracking-[-0.025em] leading-[1.18] text-balance text-[var(--color-text-primary)]"
            >
              Configure your stack to generate exact commands.
            </h2>
            <p className="mt-3 mb-0 font-editorial-sans text-base leading-[1.6] text-pretty text-[var(--color-text-secondary)]">
              Select your mediator convention, validation style, and target workflow. Standard
              MediatR, Mediator, and Wolverine repositories require zero configuration files.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] sm:mt-10 lg:grid-cols-12">
            {/* Left Controls Rail */}
            <div className="min-w-0 divide-y divide-[var(--color-border-subtle)] border-b border-[var(--color-border-strong)] lg:col-span-5 lg:border-r lg:border-b-0">
              {/* Group 1: Mediator */}
              <div className="p-4 sm:p-6">
                <h3 className="m-0 font-editorial-sans text-sm font-medium text-[var(--color-text-primary)]">
                  1. CQRS / Mediator Convention
                </h3>
                <div
                  role="group"
                  aria-label="CQRS or Mediator library"
                  className="mt-3.5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1"
                >
                  {MEDIATOR_OPTIONS.map((opt) => {
                    const selected = mediator === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setMediator(opt.id)}
                        className={`flex min-h-[48px] w-full min-w-0 cursor-pointer flex-col items-start justify-center rounded-[4px] border px-3.5 py-2.5 text-left transition-colors duration-150 ${
                          selected
                            ? 'border-[var(--color-text-primary)] bg-[var(--color-bg-sunken)]'
                            : 'border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] hover:bg-[var(--color-bg-subtle)]'
                        }`}
                      >
                        <span className="font-editorial-mono text-xs font-medium text-[var(--color-text-primary)]">
                          {opt.label}
                        </span>
                        <span className="mt-0.5 break-words [overflow-wrap:anywhere] font-editorial-sans text-xs text-[var(--color-text-secondary)]">
                          {opt.detail}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group 2: Validation */}
              <div className="p-4 sm:p-6">
                <h3 className="m-0 font-editorial-sans text-sm font-medium text-[var(--color-text-primary)]">
                  2. Command Validation Convention
                </h3>
                <div
                  role="group"
                  aria-label="Validation convention"
                  className="mt-3.5 flex flex-wrap gap-2"
                >
                  {VALIDATION_OPTIONS.map((opt) => {
                    const selected = validation === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setValidation(opt.id)}
                        className={`min-h-[44px] cursor-pointer rounded-[4px] border px-3 font-editorial-mono text-xs transition-colors duration-150 ${
                          selected
                            ? 'border-[var(--color-action-solid)] bg-[var(--color-action-solid)] text-[var(--color-action-text)]'
                            : 'border-[var(--color-border-strong)] bg-[var(--color-bg-canvas)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group 3: Workflow */}
              <div className="p-4 sm:p-6">
                <h3 className="m-0 font-editorial-sans text-sm font-medium text-[var(--color-text-primary)]">
                  3. Target Workflow
                </h3>
                <div
                  role="group"
                  aria-label="Target workflow"
                  className="mt-3.5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1"
                >
                  {WORKFLOW_OPTIONS.map((opt) => {
                    const selected = workflow === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setWorkflow(opt.id)}
                        className={`flex min-h-[48px] w-full min-w-0 cursor-pointer flex-col items-start justify-center rounded-[4px] border px-3.5 py-2.5 text-left transition-colors duration-150 ${
                          selected
                            ? 'border-[var(--color-text-primary)] bg-[var(--color-bg-sunken)]'
                            : 'border-[var(--color-border-subtle)] bg-[var(--color-bg-canvas)] hover:bg-[var(--color-bg-subtle)]'
                        }`}
                      >
                        <span className="font-editorial-mono text-xs font-medium text-[var(--color-text-primary)]">
                          {opt.label}
                        </span>
                        <span className="mt-0.5 break-words [overflow-wrap:anywhere] font-editorial-sans text-xs text-[var(--color-text-secondary)]">
                          {opt.detail}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Live Execution Blueprint */}
            <div className="flex min-w-0 flex-col justify-between p-4 sm:p-7 lg:col-span-7">
              <div className="space-y-5 sm:space-y-6">
                <CodeBlock
                  label={generated.primaryLabel}
                  code={generated.primaryCode}
                  tone="inverse"
                />

                <CodeBlock
                  label={generated.secondaryLabel}
                  code={generated.secondaryCode}
                  tone="elevated"
                />
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border-subtle)] pt-5 sm:mt-8">
                <span className="font-editorial-sans text-sm text-[var(--color-text-secondary)]">
                  Requires .NET 8.0+ runtime on host; scans target projects on .NET 6 through .NET
                  10.
                </span>
                <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                  <Link to="/docs/cli-reference" className="link-quiet">
                    <span>All CLI Flags</span>
                    <ChevronRightIcon className="size-3.5" />
                  </Link>
                  <Link to="/integrations" className="link-quiet">
                    <span>MCP &amp; CI Recipes</span>
                    <ChevronRightIcon className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three-Step Verification Checklist Ledger */}
      <section aria-labelledby="verify-heading" className="py-14 sm:py-18 md:py-24">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-14">
            <div className="min-w-0 lg:col-span-5">
              <h2
                id="verify-heading"
                className="m-0 text-[clamp(1.6rem,2.8vw,2.25rem)] font-medium tracking-[-0.025em] leading-[1.18] text-balance text-[var(--color-text-primary)]"
              >
                What happens on your first run.
              </h2>
              <p className="mt-3 mb-0 max-w-[31rem] font-editorial-sans text-base leading-[1.6] text-pretty text-[var(--color-text-secondary)]">
                {BRAND.name} never modifies your source code, invokes NuGet network calls, or phones
                home. You can run it safely inside air-gapped enterprise environments or broken
                feature branches.
              </p>
            </div>

            <div className="min-w-0 lg:col-span-7">
              <ol className="m-0 list-none divide-y divide-[var(--color-border-strong)] border-y border-[var(--color-border-strong)] p-0">
                <li className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-12 sm:gap-4">
                  <span className="font-editorial-mono text-xs text-[var(--color-text-muted)] sm:col-span-2">
                    Step 01
                  </span>
                  <div className="sm:col-span-10">
                    <h3 className="m-0 font-editorial-sans text-base font-medium text-[var(--color-text-primary)]">
                      Verify Clean Architecture Layer Classification
                    </h3>
                    <p className="mt-1.5 mb-0 max-w-[36rem] font-editorial-sans text-sm leading-[1.6] text-[var(--color-text-secondary)]">
                      Open the generated <code className="font-editorial-mono text-xs">ARCHITECTURE.md</code>{' '}
                      or <code className="font-editorial-mono text-xs">ARCHITECTURE.html</code> to
                      confirm Domain, Application, Infrastructure, and Presentation projects point
                      strictly inward.
                    </p>
                  </div>
                </li>
                <li className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-12 sm:gap-4">
                  <span className="font-editorial-mono text-xs text-[var(--color-text-muted)] sm:col-span-2">
                    Step 02
                  </span>
                  <div className="sm:col-span-10">
                    <h3 className="m-0 font-editorial-sans text-base font-medium text-[var(--color-text-primary)]">
                      Review the 11 Static Check Findings
                    </h3>
                    <p className="mt-1.5 mb-0 max-w-[36rem] font-editorial-sans text-sm leading-[1.6] text-[var(--color-text-secondary)]">
                      Inspect any <code className="font-editorial-mono text-xs">MissingHandler</code>,{' '}
                      <code className="font-editorial-mono text-xs">CommandWithoutValidator</code>, or{' '}
                      <code className="font-editorial-mono text-xs">UnreachableRequest</code>{' '}
                      diagnostics, and tune severities in{' '}
                      <Link to="/docs/configuration" className="text-[var(--color-text-primary)]">
                        .cqrslens.json
                      </Link>
                      .
                    </p>
                  </div>
                </li>
                <li className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-12 sm:gap-4">
                  <span className="font-editorial-mono text-xs text-[var(--color-text-muted)] sm:col-span-2">
                    Step 03
                  </span>
                  <div className="sm:col-span-10">
                    <h3 className="m-0 font-editorial-sans text-base font-medium text-[var(--color-text-primary)]">
                      Wire Your AI Coding Agent &amp; CI Pipeline
                    </h3>
                    <p className="mt-1.5 mb-0 max-w-[36rem] font-editorial-sans text-sm leading-[1.6] text-[var(--color-text-secondary)]">
                      Connect <code className="font-editorial-mono text-xs">--mcp</code> in your
                      editor so agents stop grepping blindly, and lock in architectural guardrails
                      with <code className="font-editorial-mono text-xs">--strict</code> in CI.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default QuickstartPage;
