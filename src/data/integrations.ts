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
    signature: 'get_architecture_dna()',
    purpose:
      'Returns compact solution topology: classified Clean Architecture layers, mediator & validation conventions, DbContexts, and a 1-line index of every Command and Query.',
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
    signature: 'trace_slice(requestName: string)',
    purpose:
      'Traces a single Command or Query end-to-end with exact File:Line coordinates across endpoint dispatch, validator, pipeline behaviors, handler, EF Core DbSets, and published domain events.',
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
    signature: 'trace_entity_impact(entityOrDbSet: string)',
    purpose:
      'Computes the reverse blast-radius map of every Command, Query, and Notification Handler that reads or mutates a specific EF Core entity / DbSet.',
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
    name: 'check_architecture',
    signature: 'check_architecture(strict?: boolean)',
    purpose:
      'Executes all 11 static CQRS and Clean Architecture rules in a single source pass and returns structured File:Line diagnostics.',
    whenAgentCallsIt:
      'Immediately after generating a new vertical slice so the agent self-corrects missing validators, orphan notifications, or layer violations before finishing.',
    sampleResponse: `Checks Completed (11 rules evaluated)
  Errors   : 0
  Warnings : 1
    [WARN] CommandWithoutValidator
      Target : RefundOrderCommand (src/Ordering.Application/Refunds/RefundOrderCommand.cs:6)
      Fix    : Add AbstractValidator<RefundOrderCommand> in Ordering.Application.`,
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
      'Commit a workspace MCP configuration in .cursor/mcp.json so Composer and Agent mode automatically load all four topology tools.',
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
    - ./.tools/${BRAND.cliBinary} . --strict --baseline cqrslens-baseline.json
  artifacts:
    when: always
    paths:
      - ARCHITECTURE.html`,
  },
] as const;
