import { BRAND } from '../config/brand';

export interface McpToolDoc {
  name: string;
  signature: string;
  purpose: string;
  whenAgentCallsIt: string;
  sampleResponse: string;
}

export interface AgentClientRecipe {
  id: string;
  name: string;
  configPath: string;
  summary: string;
  snippet: string;
}

export interface CiPlatformRecipe {
  id: string;
  name: string;
  configPath: string;
  highlights: readonly string[];
  snippet: string;
}

export const MCP_TOOLS: readonly McpToolDoc[] = [
  {
    name: 'get_architecture_dna',
    signature: 'get_architecture_dna(path?, analysis?, includeIndex?)',
    purpose:
      'Returns a compact Architectural DNA summary: layer & project topology, CQRS conventions (mediator library, handler layout, active pipeline behaviors), and EF Core DbContexts. Set includeIndex: true only when you need the full one-line index of every slice.',
    whenAgentCallsIt:
      'First tool call in a new session so the agent understands layer rules and naming conventions before creating or editing files.',
    sampleResponse: `Solution: OrderingService (4 projects · text scanner)
Layers:
  Domain         -> Ordering.Domain
  Application    -> Ordering.Application (MediatR + FluentValidation)
  Infrastructure -> Ordering.Infrastructure (OrderingDbContext: 6 DbSets)
  Presentation   -> Ordering.Api (Minimal APIs)

Slices (24 total):
  [CMD] CreateOrderCommand -> CreateOrderCommandHandler (Valid: CreateOrderCommandValidator)
  [CMD] CancelOrderCommand -> CancelOrderCommandHandler (Valid: CancelOrderCommandValidator)
  [QRY] GetOrderByIdQuery  -> GetOrderByIdQueryHandler  (AsNoTracking)`,
  },
  {
    name: 'trace_slice',
    signature: 'trace_slice(query: string, limit?, format?, path?, analysis?)',
    purpose:
      'Traces a single Command or Query end-to-end with exact File:Line coordinates across endpoint dispatch, validator, pipeline behaviors, handler, EF Core DbSets, and published domain events. Set format: "json" for structured typed slice data.',
    whenAgentCallsIt:
      'Before modifying an existing feature slice, instead of grepping and reading files across folders.',
    sampleResponse: `Slice: CreateOrderCommand : IRequest<Guid>
  Dispatch   : src/Ordering.Api/Endpoints/OrdersEndpoints.cs:24 (POST /api/orders)
  Contract   : src/Ordering.Application/Orders/CreateOrder/CreateOrderCommand.cs:9
  Validator  : src/Ordering.Application/Orders/CreateOrder/CreateOrderCommandValidator.cs:7
  Behaviors  : LoggingBehavior -> ValidationBehavior -> TransactionBehavior
  Handler    : src/Ordering.Application/Orders/CreateOrder/CreateOrderCommandHandler.cs:14
  DbSets     : OrderingDbContext.Orders [Write], OrderingDbContext.OrderLines [Write]
  Events     : OrderPlacedNotification -> SendOrderConfirmationHandler, ReserveStockHandler`,
  },
  {
    name: 'trace_entity_impact',
    signature: 'trace_entity_impact(entity: string, match?, limit?, path?, analysis?)',
    purpose:
      'Traces an EF Core entity or DbSet across the architecture: its schema (PKs, FKs, properties, relationships) and every Command, Query, Handler, and API Endpoint that reads, writes, or depends on it. Entity matching is exact by default, so Order never matches OrderItem.',
    whenAgentCallsIt:
      'Before altering an entity property, splitting a database table, or refactoring aggregate invariants.',
    sampleResponse: `Entity Impact: OrderingDbContext.Orders (Entity: Order)
  Mutating Commands (4):
    - CreateOrderCommandHandler (Orders/CreateOrder/CreateOrderCommandHandler.cs:31)
    - CancelOrderCommandHandler (Orders/CancelOrder/CancelOrderCommandHandler.cs:22)
    - MarkOrderPaidCommandHandler (Payments/MarkOrderPaidCommandHandler.cs:19)
    - ShipOrderCommandHandler (Fulfillment/ShipOrderCommandHandler.cs:27)
  Read Queries (3):
    - GetOrderByIdQueryHandler [AsNoTracking]
    - ListCustomerOrdersQueryHandler [AsNoTracking]
    - GetDailyRevenueReportQueryHandler [AsNoTracking]`,
  },
  {
    name: 'trace_request_impact',
    signature: 'trace_request_impact(request: string, match?, limit?, path?, analysis?)',
    purpose:
      'Traces everything one request touches and everything that references it: handler, validators, pipeline behaviors in registered order, dispatching endpoints, published notifications and handlers, DI-resolved DbContext edges, direct service calls, and reverse reach.',
    whenAgentCallsIt:
      'When assessing the blast radius of changing a Command, Query, handler dependency, or service interface.',
    sampleResponse: `# CqrsLens Request Impact Trace — \`CreateOrderCommand\` (\`OrderingService\`)

## [Command] \`CreateOrderCommand\` → \`Guid\` (\`src/Ordering.Application/Orders/CreateOrderCommand.cs:9\`) [Ordering.Application]
- Handlers: 1 · Validators: 1 · Published notifications: 1 · Endpoints: 1 · DbContext edges: 1 · Reverse reach: 1

### DbContext edges (1)
- \`handlerToDbContext\` \`CreateOrderCommandHandler\` → \`OrderingDbContext\` (resolved through DI via \`IOrderingDbContext\`) (\`src/Ordering.Application/Orders/CreateOrderCommandHandler.cs:14\`)

### Service calls (1)
- \`Add\` via \`IOrderRepository\` → \`SqlOrderRepository\` (\`src/Ordering.Application/Orders/CreateOrderCommandHandler.cs:27\`)`,
  },
  {
    name: 'check_architecture',
    signature: 'check_architecture(rules?, severity?, target?, groupBy?, limit?, path?, analysis?)',
    purpose:
      'Runs the 11 CqrsLens static architecture rules and returns active findings with File:Line locations. Filter by rule codes, severity, or target scope, or set groupBy: "project" to see per-module counts first.',
    whenAgentCallsIt:
      'Immediately after generating a new vertical slice so the agent self-corrects missing validators, orphan notifications, or layer violations before finishing.',
    sampleResponse: `# CqrsLens Architecture Checks — \`OrderingService\`
- **Filters**: severity=warning
- **Matching findings**: 1
- **Showing**: 1

- **[WARN] \`CommandWithoutValidator\`**: Command \`RefundOrderCommand\` has no validator. (\`src/Ordering.Application/Refunds/RefundOrderCommand.cs:6\`)`,
  },
  {
    name: 'verify_claim',
    signature: 'verify_claim(subject: string, relation: string, object?, path?, analysis?)',
    purpose:
      'Verifies a structured design claim (for example has handler, has validator, publishes, uses DbContext, depends on, belongs to layer, dispatched by, or their absence forms) and fails closed as supported, not supported, or not determinable.',
    whenAgentCallsIt:
      'Before stating an architectural fact in a PR review, design note, or refactoring plan so every claim is backed by scan evidence.',
    sampleResponse: `verdict: supported
claim: subject="CreateOrderCommand" relation="uses DbContext" object="OrderingDbContext"
basis: the scan model records direct DbContext use
evidence: 2 fact(s)
- request \`CreateOrderCommand\` (\`src/Ordering.Application/Orders/CreateOrderCommand.cs:9\`) owner handler(s): \`CreateOrderCommandHandler\`
- DbContext \`OrderingDbContext\` (\`src/Ordering.Infrastructure/OrderingDbContext.cs:8\`) is named by a handler dependency or flow edge`,
  },
  {
    name: 'diff_architecture',
    signature: 'diff_architecture(base: string, limit?, path?, analysis?)',
    purpose:
      'Diffs the current scan against a saved ARCHITECTURE.json snapshot or a base solution folder using the exact --diff semantics: counts first, then baseline-keyed findings delta, then paged item lists.',
    whenAgentCallsIt:
      'After implementing a feature branch to verify exactly which requests, endpoints, DbContexts, and check findings were added or resolved.',
    sampleResponse: `# CqrsLens Architecture Diff — \`OrderingService\` (base \`base-architecture.json\`)

- **Base**: \`base-architecture.json\` (\`OrderingService\`) · saved snapshot JSON
- **Head**: \`.\` (\`OrderingService\`)
- **Changed**: yes

## Shape delta
- **Requests**: +1 added · -0 removed · =23 unchanged · ~0 modified
- **Handlers**: +1 added · -0 removed · =23 unchanged
- **Endpoints**: +1 added · -0 removed · =18 unchanged

## Findings delta
- **New findings**: 0
- **Resolved findings**: 1`,
  },
] as const;

export const AGENT_RECIPES: readonly AgentClientRecipe[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    configPath: 'CLI or .mcp.json',
    summary:
      'Register cqrslens as a project-scoped stdio MCP server so Claude Code inspects slices natively.',
    snippet: `# Register in one command at your .NET solution root:
claude mcp add cqrslens -- ${BRAND.cliBinary} . --mcp

# Or commit .mcp.json at the repository root:
{
  "mcpServers": {
    "cqrslens": {
      "command": "${BRAND.cliBinary}",
      "args": [".", "--mcp"]
    }
  }
}`,
  },
  {
    id: 'cursor',
    name: 'Cursor',
    configPath: '.cursor/mcp.json',
    summary:
      'Commit a workspace MCP configuration in .cursor/mcp.json so Composer and Agent mode automatically load all seven read-only architecture tools.',
    snippet: `{
  "mcpServers": {
    "cqrslens": {
      "command": "${BRAND.cliBinary}",
      "args": [".", "--mcp"]
    }
  }
}`,
  },
  {
    id: 'vscode',
    name: 'VS Code / Copilot',
    configPath: '.vscode/mcp.json',
    summary:
      'Wire GitHub Copilot Agent mode in VS Code 1.99+ using workspaceVariable resolution.',
    snippet: `{
  "servers": {
    "cqrslens": {
      "type": "stdio",
      "command": "${BRAND.cliBinary}",
      "args": ["\${workspaceFolder}", "--mcp"]
    }
  }
}`,
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    configPath: 'mcp_config.json',
    summary:
      'Point Antigravity at your active .NET solution root over stdio so architecture queries use the live static map instead of ad-hoc file greps.',
    snippet: `{
  "mcpServers": {
    "cqrslens": {
      "command": "${BRAND.cliBinary}",
      "args": ["D:/repos/OrderingService", "--mcp"]
    }
  }
}`,
  },
  {
    id: 'static-agent-file',
    name: 'Static Context File',
    configPath: 'ARCHITECTURE.agent.md',
    summary:
      'Using an agent or web chat without MCP support? Emit a token-compressed single-file architecture map and reference it from AGENTS.md or CLAUDE.md.',
    snippet: `# Generate compact architectural DNA file
${BRAND.cliBinary} . --format agent -o ARCHITECTURE.agent.md

# Reference inside AGENTS.md or CLAUDE.md:
Read @ARCHITECTURE.agent.md before adding or refactoring CQRS slices.`,
  },
] as const;

export const CI_RECIPES: readonly CiPlatformRecipe[] = [
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    configPath: '.github/workflows/architecture.yml',
    highlights: [
      'Runs without dotnet restore or dotnet build',
      'Posts/updates a sticky PR comment with a Mermaid delta diagram of added/changed slices',
      'Uploads SARIF 2.1.0 findings directly to GitHub Code Scanning',
    ],
    snippet: `name: Architecture Guardrails

on:
  pull_request:
    paths:
      - 'src/**'
      - '.cqrslens.json'
      - 'cqrslens-baseline.json'

permissions:
  contents: read
  pull-requests: write
  security-events: write

jobs:
  cqrslens:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: AbdullahHakima/cqrslens@v${BRAND.version}
        with:
          path: src
          strict: 'true'
          baseline: cqrslens-baseline.json
          comment-pr: 'true'
          annotations: 'true'
          sarif-output: cqrslens-results.sarif

      - name: Upload SARIF to GitHub Code Scanning
        if: always()
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: cqrslens-results.sarif`,
  },
  {
    id: 'azure-devops',
    name: 'Azure DevOps Pipelines',
    configPath: 'azure-pipelines.yml',
    highlights: [
      'First-class fit for enterprise .NET repositories on Azure Repos',
      'Publishes zero-JS offline ARCHITECTURE.html (--render svg) and SARIF build artifacts',
      'Fails fast on exit code 4 when unbaselined layer or handler errors appear',
    ],
    snippet: `trigger:
  branches:
    include: [ main ]

pr:
  branches:
    include: [ main ]

pool:
  vmImage: 'ubuntu-latest'

steps:
  - checkout: self
    fetchDepth: 0

  - task: UseDotNet@2
    inputs:
      packageType: 'sdk'
      version: '8.0.x'

  - script: |
      dotnet tool install --tool-path ./.tools ${BRAND.nugetPackage} --version ${BRAND.version}
      ./.tools/${BRAND.cliBinary} src --format html --render svg -o $(Build.ArtifactStagingDirectory)/ARCHITECTURE.html
      ./.tools/${BRAND.cliBinary} src --strict --baseline cqrslens-baseline.json --sarif $(Build.ArtifactStagingDirectory)/cqrslens.sarif
    displayName: 'Run Static CQRS & Layer Checks'

  - publish: $(Build.ArtifactStagingDirectory)
    artifact: ArchitectureCartography
    condition: always()`,
  },
  {
    id: 'gitlab-ci',
    name: 'GitLab CI',
    configPath: '.gitlab-ci.yml',
    highlights: [
      'Uses official mcr.microsoft.com/dotnet/sdk:8.0 container with zero build prerequisite',
      'Exposes ARCHITECTURE.html and ARCHITECTURE.json as downloadable job artifacts',
    ],
    snippet: `architecture_gate:
  stage: test
  image: mcr.microsoft.com/dotnet/sdk:8.0
  script:
    - dotnet tool install --tool-path ./.tools ${BRAND.nugetPackage} --version ${BRAND.version}
    - ./.tools/${BRAND.cliBinary} . --format html --render svg -o ARCHITECTURE.html
    - ./.tools/${BRAND.cliBinary} . --format json -o ARCHITECTURE.json
    - ./.tools/${BRAND.cliBinary} . --strict --baseline cqrslens-baseline.json
  artifacts:
    when: always
    paths:
      - ARCHITECTURE.html
      - ARCHITECTURE.json`,
  },
] as const;
