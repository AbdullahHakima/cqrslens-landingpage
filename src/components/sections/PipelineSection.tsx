import React from 'react';

const STAGES = [
  {
    step: '1',
    title: 'Project Graph Discovery',
    detail:
      'Walks .csproj XML ProjectReference edges directly (skipping bin, obj, .git) and classifies Clean Architecture layers.',
    artifact: 'Layer & Dependency DAG',
  },
  {
    step: '2',
    title: 'Parallel Source Reader',
    detail:
      'Streams .cs files across all CPU cores without invoking MSBuild, NuGet restore, or package resolution.',
    artifact: 'Source AST / Token Buffers',
  },
  {
    step: '3',
    title: 'Convention & Marker Detection',
    detail:
      'Recognizes MediatR, martinothamar/Mediator, and Wolverine conventions automatically, plus custom marker interface roots.',
    artifact: 'Requests, Handlers, Validators',
  },
  {
    step: '4',
    title: 'Namespace & Arity Linker',
    detail:
      'Resolves MSBuild <Using>, global usings, type aliases, generic arity overloads, and base-class response substitution.',
    artifact: 'Verified Contract Links',
  },
  {
    step: '5',
    title: 'Dispatch & EF Core Modeler',
    detail:
      'Tracks Send/Publish call sites for reachability and builds DbContext ER relationships from attributes and Fluent API.',
    artifact: 'Flow Edges & ER Schemas',
  },
  {
    step: '6',
    title: 'Deterministic Renderer',
    detail:
      'Emits byte-reproducible Markdown, offline zero-JS SVG HTML, schema-versioned JSON, SARIF, or live MCP responses.',
    artifact: 'ARCHITECTURE.md / .html / .json',
  },
] as const;

export const PipelineSection: React.FC = () => (
  <section
    id="pipeline"
    aria-labelledby="pipeline-heading"
    className="cv-auto border-t border-[var(--color-border-subtle)] py-14 sm:py-18 md:py-24 lg:py-28"
  >
    <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Left Thesis & Dual-Backend Comparison */}
        <div className="min-w-0 lg:col-span-5">
          <h2
            id="pipeline-heading"
            className="m-0 text-[clamp(1.7rem,3.2vw,2.65rem)] font-medium tracking-[-0.025em] leading-[1.16] text-balance text-[var(--color-text-primary)]"
          >
            Six compiler-free stages. Maps solutions that do not even build.
          </h2>
          <p className="mt-4 max-w-[31rem] text-base leading-[1.6] text-pretty text-[var(--color-text-secondary)] sm:mt-5">
            When you inherit a broken branch or audit a 100-project monorepo in CI, waiting for
            package restore and compilation defeats fast feedback. Both analysis engines operate
            purely on source files.
          </p>

          {/* Dual Engine Ledger: Stacked when Column is Narrow (< sm or lg split), Table on Wide Containers */}
          <div className="mt-7 border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] sm:mt-8">
            <div className="divide-y divide-[var(--color-border-subtle)] tabular-data sm:hidden lg:block xl:hidden">
              <div className="p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <code className="font-editorial-mono text-xs font-medium text-[var(--color-text-primary)]">
                    --analysis text
                  </code>
                  <span className="font-editorial-sans text-xs text-[var(--color-text-secondary)]">
                    Default, ultra-fast
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-editorial-mono text-xs">
                  <span className="text-[var(--color-text-primary)]">
                    <span className="font-editorial-sans text-[var(--color-text-muted)]">
                      Analysis:{' '}
                    </span>
                    Parallel lexical
                  </span>
                  <span className="text-[var(--color-text-secondary)]">
                    <span className="font-editorial-sans text-[var(--color-text-muted)]">
                      Relative cost:{' '}
                    </span>
                    Lowest
                  </span>
                </div>
              </div>
              <div className="p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <code className="font-editorial-mono text-xs font-medium text-[var(--color-text-primary)]">
                    --analysis roslyn
                  </code>
                  <span className="font-editorial-sans text-xs text-[var(--color-text-secondary)]">
                    Symbol-aware, no build
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-editorial-mono text-xs">
                  <span className="text-[var(--color-text-primary)]">
                    <span className="font-editorial-sans text-[var(--color-text-muted)]">
                      Analysis:{' '}
                    </span>
                    Syntax & symbol trees
                  </span>
                  <span className="text-[var(--color-text-secondary)]">
                    <span className="font-editorial-sans text-[var(--color-text-muted)]">
                      Relative cost:{' '}
                    </span>
                    Higher
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden overflow-x-auto sm:block lg:hidden xl:block">
              <table className="w-full border-collapse text-left text-xs tabular-data">
                <thead>
                  <tr className="border-b border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] font-editorial-sans text-xs text-[var(--color-text-secondary)] xl:text-[0.8125rem]">
                    <th scope="col" className="px-3 py-2.5 font-medium xl:px-4 xl:py-3">
                      Backend
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-medium xl:px-4 xl:py-3">
                      Analysis
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-medium xl:px-4 xl:py-3">
                      Relative cost
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-medium xl:px-4 xl:py-3">
                      Resolution
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-subtle)]">
                  <tr>
                    <td className="px-3 py-2.5 font-medium whitespace-nowrap text-[var(--color-text-primary)] xl:px-4 xl:py-3">
                      <code className="font-editorial-mono">--analysis text</code>
                    </td>
                    <td className="px-3 py-2.5 font-editorial-sans text-xs text-[var(--color-text-secondary)] xl:px-4 xl:py-3 xl:text-[0.8125rem]">
                      Parallel lexical scan
                    </td>
                    <td className="px-3 py-2.5 font-editorial-mono whitespace-nowrap text-[var(--color-text-primary)] xl:px-4 xl:py-3">
                      Lowest
                    </td>
                    <td className="px-3 py-2.5 font-editorial-sans text-xs text-[var(--color-text-secondary)] xl:px-4 xl:py-3 xl:text-[0.8125rem]">
                      Default, ultra-fast
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2.5 font-medium whitespace-nowrap text-[var(--color-text-primary)] xl:px-4 xl:py-3">
                      <code className="font-editorial-mono">--analysis roslyn</code>
                    </td>
                    <td className="px-3 py-2.5 font-editorial-sans text-xs text-[var(--color-text-secondary)] xl:px-4 xl:py-3 xl:text-[0.8125rem]">
                      Syntax &amp; symbol trees
                    </td>
                    <td className="px-3 py-2.5 font-editorial-mono whitespace-nowrap text-[var(--color-text-secondary)] xl:px-4 xl:py-3">
                      Higher
                    </td>
                    <td className="px-3 py-2.5 font-editorial-sans text-xs text-[var(--color-text-secondary)] xl:px-4 xl:py-3 xl:text-[0.8125rem]">
                      Symbol-aware, no build
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-4 mb-0 max-w-[30rem] font-editorial-sans text-[0.8125rem] text-[var(--color-text-muted)]">
            Auto-detects MediatR, martinothamar/Mediator, Wolverine, FluentValidation,
            FastEndpoints, and EF Core.
          </p>
        </div>

        {/* Right 6-Stage Sequential Ledger */}
        <div className="min-w-0 lg:col-span-7">
          <ol className="m-0 list-none divide-y divide-[var(--color-border-strong)] border-y border-[var(--color-border-strong)] p-0">
            {STAGES.map((stage) => (
              <li
                key={stage.step}
                className="grid grid-cols-1 gap-1.5 py-4 sm:grid-cols-12 sm:items-baseline sm:gap-4 sm:py-5"
              >
                <div className="font-editorial-mono text-xs text-[var(--color-text-muted)] tabular-data sm:col-span-1">
                  0{stage.step}
                </div>
                <div className="min-w-0 sm:col-span-7">
                  <h3 className="m-0 font-editorial-sans text-base font-medium text-[var(--color-text-primary)]">
                    {stage.title}
                  </h3>
                  <p className="mt-1 mb-0 max-w-[27rem] text-sm leading-[1.55] text-pretty text-[var(--color-text-secondary)]">
                    {stage.detail}
                  </p>
                </div>
                <div className="font-editorial-sans text-[0.8125rem] font-medium text-[var(--color-text-secondary)] sm:col-span-4 sm:text-right">
                  {stage.artifact}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  </section>
);
