import { BRAND } from '../config/brand';

export interface DocTableRow {
  col1: string;
  col2: string;
  col3: string;
  col4?: string;
}

export interface DocSubsection {
  id: string;
  heading: string;
  paragraphs: readonly string[];
  code?: {
    label: string;
    snippet: string;
  };
  table?: {
    headers: readonly string[];
    rows: readonly DocTableRow[];
  };
  note?: string;
}

export interface DocChapter {
  slug: string;
  navTitle: string;
  title: string;
  lead: string;
  subsections: readonly DocSubsection[];
}

export const DOC_CHAPTERS: readonly DocChapter[] = [
  {
    slug: 'overview',
    navTitle: 'Overview & Concepts',
    title: 'Overview & Core Concepts',
    lead: `${BRAND.name} (${BRAND.cliBinary}) is a compiler-free static architecture cartographer for .NET solutions. It reads .csproj and .cs source files directly to map Clean Architecture layers, CQRS vertical slices, EF Core DbContexts, and architectural rule violations without invoking MSBuild.`,
    subsections: [
      {
        id: 'why-static-cartography',
        heading: 'Why compiler-free static cartography?',
        paragraphs: [
          'Traditional .NET architecture tools inspect compiled assemblies via reflection or MSBuild workspaces. That requires NuGet package restore, environment secrets, generated code, and a clean build before you can see a single diagram.',
          'When you inherit an unfamiliar monorepo, review a broken pull request branch, or wire an AI coding agent over MCP, a full restore and build is a slow prerequisite that can fail before analysis starts. CqrsLens operates directly on source files, so it can map the solution without invoking MSBuild or compiling assemblies. Actual timings vary by hardware, repository shape, and file-system cache warmth.',
        ],
      },
      {
        id: 'supported-conventions',
        heading: 'Supported .NET frameworks & conventions',
        paragraphs: [
          'No attributes or code changes are required in your application. The convention detector identifies standard CQRS, validation, and data-access contracts out of the box:',
        ],
        table: {
          headers: ['Concern', 'Detected Libraries & Contracts', 'Extracted Artifacts'],
          rows: [
            {
              col1: 'CQRS Mediators',
              col2: 'MediatR, martinothamar/Mediator, Wolverine, custom marker interfaces',
              col3: 'Commands, Queries, Handlers, Notifications, Pipeline Behaviors',
            },
            {
              col1: 'Validation',
              col2: 'FluentValidation (AbstractValidator<T>), FastEndpoints (Validator<T>)',
              col3: 'Request-to-Validator links, CommandWithoutValidator & OrphanValidator checks',
            },
            {
              col1: 'Persistence',
              col2: 'Entity Framework Core (DbContext, DbSet<T>, Fluent API, Attributes)',
              col3: 'DbContext ER diagrams, per-slice DbSet read/write & AsNoTracking touches',
            },
            {
              col1: 'Dispatch Sites',
              col2: 'ASP.NET Core Controllers, Minimal APIs, FastEndpoints, background workers',
              col3: 'Send() & Publish() File:Line coordinates and reachability edges',
            },
          ],
        },
      },
      {
        id: 'six-stage-pipeline',
        heading: 'Six-stage deterministic pipeline',
        paragraphs: [
          'Every invocation executes six deterministic stages: (1) .csproj ProjectReference DAG discovery and layer classification, (2) multi-core source streaming, (3) CQRS/validator/DbContext marker extraction, (4) namespace, global-using, and generic-arity linking, (5) dispatch and EF Core ER modeling, and (6) byte-reproducible output rendering.',
          'Because all collections are canonically sorted before rendering, pairing this with a fixed `--generated-at` timestamp keeps ARCHITECTURE.md or ARCHITECTURE.json free of run-specific noise when nothing structural changed.',
        ],
      },
    ],
  },
  {
    slug: 'installation',
    navTitle: 'Installation',
    title: 'Installation & Requirements',
    lead: `Distributed on NuGet as a .NET 8+ tool (${BRAND.nugetPackage} v${BRAND.version}). Runs on Windows, macOS, and Linux (x64 and ARM64) with no external runtime services.`,
    subsections: [
      {
        id: 'global-tool',
        heading: 'Global CLI installation (recommended for local use & MCP)',
        paragraphs: [
          'Install the binary globally so cqrslens is available on your PATH for terminal exploration and local MCP coding agents:',
        ],
        code: {
          label: 'Terminal · Global .NET Tool',
          snippet: `# Install latest release from NuGet
dotnet tool install -g ${BRAND.nugetPackage}

# Upgrade an existing installation
dotnet tool update -g ${BRAND.nugetPackage}

# Verify binary and version
${BRAND.cliBinary} --version`,
        },
      },
      {
        id: 'local-tool-manifest',
        heading: 'Repository-pinned tool manifest (recommended for teams & CI)',
        paragraphs: [
          'Pin the exact CLI version in .config/dotnet-tools.json so every developer and CI runner executes identical rule semantics:',
        ],
        code: {
          label: 'Terminal · Local Tool Manifest',
          snippet: `# Initialize a tool manifest if your repo does not have one
dotnet new tool-manifest

# Pin ${BRAND.nugetPackage} v${BRAND.version}
dotnet tool install ${BRAND.nugetPackage} --version ${BRAND.version}

# Run anywhere in the repository
dotnet tool restore
dotnet ${BRAND.cliBinary} . --strict`,
        },
      },
      {
        id: 'runtime-requirements',
        heading: 'SDK & target codebase compatibility',
        paragraphs: [
          'Running the CLI requires the .NET 8.0 SDK/Runtime (or newer, including .NET 9 and .NET 10) on the host machine.',
          'Because the scanner reads source XML and C# files rather than loading compiled assemblies, the target codebase you scan can target any framework—including .NET 6, .NET 7, .NET 8, .NET 9, .NET Standard 2.0, or legacy multi-targeted solutions.',
        ],
      },
    ],
  },
  {
    slug: 'cli-reference',
    navTitle: 'CLI Reference',
    title: 'CLI Flags & Arguments',
    lead: `Invoke ${BRAND.cliBinary} against any directory containing a .sln, .slnx, or nested .csproj files. By default, scanning writes or prints a Markdown architecture report.`,
    subsections: [
      {
        id: 'synopsis',
        heading: 'Command synopsis',
        paragraphs: [
          'Pass the target solution directory (or . for the current working directory) followed by output, check, or server options:',
        ],
        code: {
          label: 'Synopsis',
          snippet: `${BRAND.cliBinary} [path] [options]

# Common invocations
${BRAND.cliBinary} .
${BRAND.cliBinary} ./src --format html --render svg -o ARCHITECTURE.html
${BRAND.cliBinary} ./src --format html --render svg --cqrs-map-split feature --export-svg diagrams -o ARCHITECTURE.html
${BRAND.cliBinary} . --slice CreateOrderCommand
${BRAND.cliBinary} . --strict --baseline cqrslens-baseline.json
${BRAND.cliBinary} . --strict --sarif results.sarif
${BRAND.cliBinary} . --mcp`,
        },
      },
      {
        id: 'flags-ledger',
        heading: 'Complete options reference',
        paragraphs: [
          'All flags can be combined deterministically depending on whether you are generating documentation, tracing a single feature slice, gating a pull request, or serving MCP tools:',
        ],
        table: {
          headers: ['Flag', 'Values / Default', 'Purpose'],
          rows: [
            {
              col1: '<path>',
              col2: 'Folder containing .sln, .slnx, or .csproj',
              col3: 'Recursively scans the target solution directory.',
            },
            {
              col1: '--format <fmt>',
              col2: 'md (default) | html | json | agent',
              col3: 'Selects primary output representation. A .html, .json, or .agent.md -o path implies the matching format. SARIF is additive via --sarif, not a --format value.',
            },
            {
              col1: '-o, --output <file>',
              col2: 'ARCHITECTURE.md (or .html / .json)',
              col3: 'Writes rendered output to the specified file path.',
            },
            {
              col1: '--render <mode>',
              col2: 'mermaid (default) | svg',
              col3: 'When paired with --format html, --render svg compiles zero-JS inline SVGs for offline viewing.',
            },
            {
              col1: '--cqrs-map-split <mode>',
              col2: 'count (default) | feature | unsplit',
              col3: 'Controls CQRS map splitting: by project then size, one diagram per feature, or one diagram per project. Reporting-only; does not change JSON output.',
            },
            {
              col1: '--slice <filter>',
              col2: 'Endpoint, request, handler, entity, or event name',
              col3: 'Prints an end-to-end vertical slice trace. Streams to stdout when -o is omitted.',
            },
            {
              col1: '--analysis <engine>',
              col2: 'text (default) | roslyn',
              col3: 'Selects the lexical text scanner or the no-build Roslyn syntax/symbol backend.',
            },
            {
              col1: '--config <file>',
              col2: '<path>/.cqrslens.json when present',
              col3: 'Reads an explicit configuration file; CLI flags override matching values.',
            },
            {
              col1: '--markers <list>',
              col2: 'Comma-separated interface names',
              col3: 'Adds custom request-root markers (for example ICommand,IQuery,IMessage).',
            },
            {
              col1: '--handler-markers <list>',
              col2: 'Comma-separated interface names',
              col3: 'Adds handler roots supplied by external packages; source-declared wrappers are followed automatically.',
            },
            {
              col1: '--strict',
              col2: 'Boolean (false)',
              col3: 'Exits with code 4 when unbaselined error-severity findings exist and the scan is complete.',
            },
            {
              col1: '--diff <path-or-json>',
              col2: 'Base ARCHITECTURE.json or solution folder',
              col3: 'Compares the current scan against a base report or checkout to show CQRS and architecture changes.',
            },
            {
              col1: '--diff-output <file>',
              col2: '.md or .json',
              col3: 'Writes the architecture diff report for PR comments or downstream tooling.',
            },
            {
              col1: '--baseline <file>',
              col2: 'Baseline JSON file',
              col3: 'Suppresses pre-existing findings matching rule + target + relative file; --strict then fails only on new errors.',
            },
            {
              col1: '--write-baseline <file>',
              col2: 'Baseline JSON file',
              col3: 'Records current findings into a deterministic baseline for incremental adoption.',
            },
            {
              col1: '--sarif <file>',
              col2: 'results.sarif',
              col3: 'Also writes SARIF 2.1.0 diagnostics alongside normal output for code scanning or IDE viewers.',
            },
            {
              col1: '--summary <file>',
              col2: 'Markdown summary file',
              col3: 'Also writes a compact Markdown job summary for CI dashboards.',
            },
            {
              col1: '--export-svg <dir>',
              col2: 'Output directory (created if missing)',
              col3: 'Writes every diagram as a standalone .svg file. Additive; does not change the primary report. SVG only, no PNG.',
            },
            {
              col1: '--github-annotations',
              col2: 'Boolean',
              col3: 'Emits file/line GitHub Actions annotations.',
            },
            {
              col1: '--ci-root <dir>',
              col2: 'Repository root',
              col3: 'Rebases annotation and SARIF paths against the CI checkout root.',
            },
            {
              col1: '--profile',
              col2: 'Boolean',
              col3: 'Prints per-stage timing and allocation totals to stderr.',
            },
            {
              col1: '--generated-at <ISO8601>',
              col2: 'Fixed timestamp',
              col3: 'Makes reports reproducible; timing is reported as 0 ms in this mode.',
            },
            {
              col1: '--watermark <text>',
              col2: 'Custom text',
              col3: 'Renders a block ASCII watermark in the console and embeds it in reports.',
            },
            {
              col1: '--banner | --no-banner',
              col2: 'Automatic',
              col3: 'Forces or suppresses the ASCII logo banner and summary card.',
            },
            {
              col1: '--color | --no-color',
              col2: 'Automatic (respects NO_COLOR)',
              col3: 'Forces or disables ANSI 24-bit console colors.',
            },
            {
              col1: '--mcp',
              col2: 'stdio server mode',
              col3: 'Starts the Model Context Protocol server over JSON-RPC 2.0 stdin/stdout.',
            },
            {
              col1: '-h, --help | --version',
              col2: 'Boolean',
              col3: 'Prints the full option reference or tool version and exits.',
            },
          ],
        },
      },
    ],
  },
  {
    slug: 'configuration',
    navTitle: 'Configuration (.cqrslens.json)',
    title: 'Repository Configuration (.cqrslens.json)',
    lead: 'Zero configuration is needed to start. When your architecture uses custom marker interfaces, monorepo test folders, or tailored CI severities, place a .cqrslens.json file at the scan root.',
    subsections: [
      {
        id: 'schema-example',
        heading: 'Full .cqrslens.json example',
        paragraphs: [
          'The scanner automatically discovers .cqrslens.json in the target directory. Every field is optional; unknown keys or invalid values fail with exit code 1 instead of being silently ignored:',
        ],
        code: {
          label: '.cqrslens.json',
          snippet: `{
  "$schema": "https://raw.githubusercontent.com/AbdullahHakima/cqrslens/main/cqrslens.schema.json",
  "analysis": "text",
  "render": "svg",
  "cqrsMapSplit": "feature",
  "watermark": "CONTOSO ARCHITECTURE",
  "markers": ["ICommand", "IQuery", "IMessage"],
  "handlerMarkers": ["ICommandHandler", "IQueryHandler"],
  "include": ["src/**"],
  "exclude": [
    "**/Migrations/**",
    "**/Generated/**",
    "**/obj/**"
  ],
  "layers": {
    "Contoso.Domain": "Domain",
    "Contoso.Application": "Application",
    "Contoso.Infrastructure": "Infrastructure",
    "Contoso.Api": "Api"
  },
  "rules": {
    "MissingHandler": "error",
    "MultipleHandlers": "error",
    "LayerViolation": "error",
    "ApplicationLayerViolation": "error",
    "CircularProjectDependency": "error",
    "CommandWithoutValidator": "warning",
    "OrphanValidator": "warning",
    "OrphanNotification": "warning",
    "UnreachableRequest": "off",
    "UnpublishedNotification": "warning",
    "AmbiguousProjectName": "warning"
  }
}`,
        },
      },
      {
        id: 'severity-levels',
        heading: 'Rule severity semantics',
        paragraphs: [
          'Each of the 11 static checks accepts one of three values: "error" (fails --strict runs with exit code 4 on a complete scan), "warning" (reported in Markdown, HTML, SARIF, and PR comments without failing the build), or "off" (removes the finding from reports and strict evaluation).',
          'LayerViolation and ApplicationLayerViolation default to warning when no layer model is asserted. They escalate to error when you configure layers or the scanner finds a confident conventional layer layout; an explicit rules override always wins.',
          'Promoting CommandWithoutValidator or UnreachableRequest from "warning" to "error" is a common milestone once legacy debt is captured in a baseline.',
        ],
      },
    ],
  },
  {
    slug: 'output-formats',
    navTitle: 'Output Formats',
    title: 'Output Formats & Artifacts',
    lead: 'One static model drives Markdown, HTML, JSON, agent, SARIF, and standalone SVG outputs so humans, pull requests, security dashboards, and LLM coding agents read the same architectural truth.',
    subsections: [
      {
        id: 'format-comparison',
        heading: 'Choosing the right format',
        paragraphs: [
          'Select the representation matching the consumer of the report:',
        ],
        table: {
          headers: ['Format', 'Invocation', 'Best For'],
          rows: [
            {
              col1: 'ARCHITECTURE.md',
              col2: '--format md',
              col3: 'Committing to git; renders layer, flow, behavior-chain, slice, and ER diagrams natively on GitHub, GitLab, and Azure DevOps.',
            },
            {
              col1: 'ARCHITECTURE.html',
              col2: '--format html --render svg',
              col3: 'Interactive offline architectural explorer with pre-compiled zero-JS inline SVGs—safe for locked-down CI artifact viewers.',
            },
            {
              col1: 'ARCHITECTURE.json',
              col2: '--format json',
              col3: 'Machine-readable schema containing projects, layer edges, slices, DbSets, flow edges, and findings for custom dashboards.',
            },
            {
              col1: 'ARCHITECTURE.agent.md',
              col2: '--format agent',
              col3: 'High-density token-packed codebase index for pasting into LLM prompts or CLAUDE.md / AGENTS.md context.',
            },
            {
              col1: 'SARIF 2.1.0',
              col2: '--sarif results.sarif',
              col3: 'GitHub Code Scanning security tab annotations and IDE SARIF viewers with exact File:Line locations. Additive to the primary report.',
            },
            {
              col1: 'Standalone SVG diagrams',
              col2: '--export-svg diagrams',
              col3: 'Writes every diagram as its own .svg document for docs and READMEs. Additive; SVG only, no PNG.',
            },
          ],
        },
      },
    ],
  },
  {
    slug: 'analysis-engines',
    navTitle: 'Text vs. Roslyn Engines',
    title: 'Dual Analysis Engines (Text vs. Roslyn)',
    lead: 'Both scanning backends operate purely on source files without invoking MSBuild or compiling assemblies. The tool test suite compares text and Roslyn contract linking on SampleShop and adversarial fixtures; the public validation corpus remains informational rather than a release gate.',
    subsections: [
      {
        id: 'engine-tradeoffs',
        heading: 'Performance & resolution comparison',
        paragraphs: [
          'The default text backend uses a purpose-built C# declaration, generic-arity, and namespace scanner across all CPU cores. The optional roslyn backend parses full CSharpSyntaxTree and lightweight symbol tables without package restore.',
        ],
        table: {
          headers: ['Dimension', '--analysis text (Default)', '--analysis roslyn'],
          rows: [
            {
              col1: 'Analysis model',
              col2: 'Parallel lexical declaration scan',
              col3: 'CSharpSyntaxTree + lightweight symbol tables',
            },
            {
              col1: 'Relative scan cost',
              col2: 'Lower',
              col3: 'Higher',
            },
            {
              col1: 'Relative memory footprint',
              col2: 'Lower',
              col3: 'Higher',
            },
            {
              col1: 'Requires dotnet build?',
              col2: 'No',
              col3: 'No',
            },
            {
              col1: 'Recommended Use',
              col2: 'Local CLI, --mcp live queries, fast pre-commit hooks, and standard CI.',
              col3: 'Heavily macro/partial-class codebases or cross-checking complex generic inheritance.',
            },
          ],
        },
        note: 'Cost and memory comparisons are qualitative. Absolute timings vary by hardware, GC state, repository shape, and file-system cache warmth.',
      },
    ],
  },
  {
    slug: 'exit-codes',
    navTitle: 'Exit Codes & Baselines',
    title: 'Deterministic Exit Codes & Legacy Baselines',
    lead: 'CI pipelines require predictable failure semantics that distinguish real architectural regressions from CLI usage mistakes or incomplete checkouts.',
    subsections: [
      {
        id: 'exit-code-ledger',
        heading: 'Process exit codes',
        paragraphs: [
          'When scripting cqrslens in GitHub Actions, Azure DevOps, or GitLab CI, inspect the process exit code:',
        ],
        table: {
          headers: ['Exit Code', 'Condition', 'CI Interpretation'],
          rows: [
            {
              col1: '0',
              col2: 'Scan succeeded (and in --strict mode, zero unbaselined error findings triggered).',
              col3: 'Pass step.',
            },
            {
              col1: '1',
              col2: 'Usage error: invalid CLI arguments, unknown config key, or malformed .cqrslens.json.',
              col3: 'Configuration or invocation error.',
            },
            {
              col1: '2',
              col2: 'Target path does not exist.',
              col3: 'Checkout or path-scoping error.',
            },
            {
              col1: '3',
              col2: 'Target path contains no discoverable .sln, .slnx, or .csproj files.',
              col3: 'Wrong scan root or incomplete checkout.',
            },
            {
              col1: '4',
              col2: '--strict detected one or more unbaselined architecture errors on a complete scan.',
              col3: 'Block pull request merge.',
            },
            {
              col1: '5',
              col2: 'Unexpected unhandled runtime or I/O failure.',
              col3: 'Infrastructure/tool error.',
            },
          ],
        },
      },
      {
        id: 'line-independent-baselines',
        heading: 'Line-number-independent baselines',
        paragraphs: [
          'Adopting strict architecture checks on a 5-year-old codebase fails if you have to fix 60 legacy warnings on day one. Generate a baseline once, commit it, and enforce zero new violations going forward:',
        ],
        code: {
          label: 'Incremental Baseline Workflow',
          snippet: `# 1. Snapshot current legacy debt once
${BRAND.cliBinary} src --write-baseline cqrslens-baseline.json

# 2. Enforce strict checks on every PR against the baseline
${BRAND.cliBinary} src --strict --baseline cqrslens-baseline.json`,
        },
        note: 'Baseline entries key on (ruleId + contractTarget + normalizedRelativePath) rather than line numbers—so formatting edits or adding imports at the top of a file never invalidates existing baseline entries.',
      },
    ],
  },
  {
    slug: 'troubleshooting',
    navTitle: 'Troubleshooting',
    title: 'Troubleshooting & FAQ',
    lead: 'Solutions to the most common edge cases encountered in custom enterprise .NET monorepos and AI editor MCP setups.',
    subsections: [
      {
        id: 'custom-mediator-wrappers',
        heading: 'Custom base classes or wrapper interfaces are not detected',
        paragraphs: [
          'If your team wraps MediatR or Wolverine behind custom interfaces beyond two levels of inheritance (for example IAuditableCommand<TResult>) declared in an external NuGet package whose source is not in the repository, declare request roots under markers and external handler wrappers under handlerMarkers in .cqrslens.json.',
        ],
      },
      {
        id: 'test-projects-false-handlers',
        heading: 'Fake test handlers trigger MultipleHandlers',
        paragraphs: [
          'Integration test projects sometimes register stub or spy IRequestHandler implementations. include and exclude filter source files, not project discovery, so scan a src subdirectory or exclude test source globs such as "**/tests/**", "**/*.Tests/**", and "**/*.IntegrationTests/**" in .cqrslens.json.',
        ],
      },
      {
        id: 'mcp-path-resolution',
        heading: 'Coding agent says "cqrslens: command not found" in MCP stdio mode',
        paragraphs: [
          'GUI editors on macOS and Windows sometimes launch without ~/.dotnet/tools in their inherited PATH. Either pass the full binary path (~/.dotnet/tools/cqrslens on macOS/Linux or %USERPROFILE%\\.dotnet\\tools\\cqrslens.exe on Windows) in mcp_config.json, or invoke dotnet tool run cqrslens.',
        ],
      },
    ],
  },
] as const;
