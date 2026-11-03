export interface GraphNode {
  id: string;
  label: string;
  role: 'presentation' | 'application' | 'infrastructure' | 'domain';
  x: number;
  y: number;
  w: number;
}

export interface GraphEdge {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export interface CorpusExampleReport {
  id: string;
  owner: string;
  repo: string;
  githubUrl: string;
  architectureStyle: string;
  mediatorStack: string;
  projects: number;
  requests: number;
  handlers: number;
  validators: number;
  behaviors: number;
  dbContexts: number;
  findingsSummary: string;
  reportNote: string;
  nodes: readonly GraphNode[];
  edges: readonly GraphEdge[];
  featuredSlice: {
    contract: string;
    kind: 'Command' | 'Query';
    dispatch: string;
    validator: string;
    pipeline: string;
    handler: string;
    persistence: string;
    diagnostic: string;
    diagnosticTone: 'pass' | 'warning';
  };
  markdownExcerpt: string;
}

export const CORPUS_EXAMPLES: readonly CorpusExampleReport[] = [
  {
    id: 'jasontaylor-clean-arch',
    owner: 'jasontaylordev/',
    repo: 'CleanArchitecture',
    githubUrl: 'https://github.com/jasontaylordev/CleanArchitecture',
    architectureStyle: '4-Layer Canonical Clean Architecture',
    mediatorStack: 'MediatR + FluentValidation + EF Core',
    projects: 13,
    requests: 11,
    handlers: 11,
    validators: 6,
    behaviors: 4,
    dbContexts: 1,
    findingsSummary: '0 errors / 6 warnings',
    reportNote: 'Warning mix: validation gaps, template reachability, and one unpublished event',
    nodes: [
      { id: 'web', label: 'CleanArchitecture.Web', role: 'presentation', x: 40, y: 24, w: 185 },
      { id: 'infra', label: 'CleanArchitecture.Infrastructure', role: 'infrastructure', x: 295, y: 24, w: 225 },
      { id: 'app', label: 'CleanArchitecture.Application', role: 'application', x: 155, y: 106, w: 215 },
      { id: 'domain', label: 'CleanArchitecture.Domain', role: 'domain', x: 175, y: 184, w: 180 },
    ],
    edges: [
      { fromX: 132, fromY: 60, toX: 230, toY: 106 },
      { fromX: 225, fromY: 42, toX: 295, toY: 42 },
      { fromX: 405, fromY: 60, toX: 310, toY: 106 },
      { fromX: 405, fromY: 60, toX: 330, toY: 184 },
      { fromX: 265, fromY: 142, toX: 265, toY: 184 },
    ],
    featuredSlice: {
      contract: 'CreateTodoItemCommand : IRequest<int>',
      kind: 'Command',
      dispatch: 'POST /api/TodoItems (inferred route) · Web/Endpoints/TodoItems.cs:23',
      validator:
        'CreateTodoItemCommandValidator · Application/TodoItems/Commands/CreateTodoItem/CreateTodoItemCommandValidator.cs:3',
      pipeline: 'ValidationBehaviour + 3 more in scan order (not execution order)',
      handler:
        'CreateTodoItemCommandHandler · Application/TodoItems/Commands/CreateTodoItem/CreateTodoItem.cs:13',
      persistence: 'IApplicationDbContext.TodoItems → TodoItem',
      diagnostic:
        '[PASS] Handler, validator, and EF Core DbSet linked. Six project-level warnings remain.',
      diagnosticTone: 'pass',
    },
    markdownExcerpt: `# CleanArchitecture — CqrsLens 0.9.0 Snapshot
- **Projects Scanned**: 13
- **CQRS Requests**: 11 (11 handlers linked, 6 validators)
- **Pipeline Behaviors**: 4 (recorded in scan order)
- **EF Core Contexts**: ApplicationDbContext (TodoItems → TodoItem)
- **Architecture Checks**: 0 errors / 6 warnings
- **Warnings**: 3 CommandWithoutValidator · 2 UnreachableRequest · 1 UnpublishedNotification
- **Reachability Note**: both UnreachableRequest findings are template requests with no production call site
- **Snapshot**: text scanner · 2026-11-02`,
  },
  {
    id: 'kgrzybek-modular-monolith',
    owner: 'kgrzybek/',
    repo: 'modular-monolith-with-ddd',
    githubUrl: 'https://github.com/kgrzybek/modular-monolith-with-ddd',
    architectureStyle: 'DDD Modular Monolith (5 Bounded Contexts)',
    mediatorStack: 'MediatR + Custom ICommand / IQuery Markers + EF Core',
    projects: 47,
    requests: 105,
    handlers: 105,
    validators: 5,
    behaviors: 0,
    dbContexts: 4,
    findingsSummary: '0 errors / 205 warnings',
    reportNote: 'Custom CommandBase hierarchy resolved across 47 projects without a build',
    nodes: [
      { id: 'api', label: 'CompanyMeetings.API', role: 'presentation', x: 185, y: 20, w: 180 },
      { id: 'meetings', label: 'Module: Meetings', role: 'application', x: 25, y: 104, w: 150 },
      { id: 'payments', label: 'Module: Payments', role: 'application', x: 198, y: 104, w: 155 },
      { id: 'users', label: 'Module: UserAccess', role: 'application', x: 375, y: 104, w: 160 },
      { id: 'bblocks', label: 'BuildingBlocks.Domain & EventBus', role: 'domain', x: 145, y: 184, w: 260 },
    ],
    edges: [
      { fromX: 235, fromY: 56, toX: 110, toY: 104 },
      { fromX: 275, fromY: 56, toX: 275, toY: 104 },
      { fromX: 315, fromY: 56, toX: 445, toY: 104 },
      { fromX: 110, fromY: 140, toX: 225, toY: 184 },
      { fromX: 275, fromY: 140, toX: 275, toY: 184 },
      { fromX: 445, fromY: 140, toX: 325, toY: 184 },
    ],
    featuredSlice: {
      contract: 'CreateMeetingCommand : CommandBase',
      kind: 'Command',
      dispatch: 'POST /api/meetings/meetings · MeetingsController.CreateNewMeeting (line 52)',
      validator: 'None linked (1 of 71 CommandWithoutValidator warnings)',
      pipeline: 'No pipeline behaviors registered',
      handler:
        'CreateMeetingCommandHandler · Meetings/Application/Meetings/CreateMeeting/CreateMeetingCommandHandler.cs:8',
      persistence: 'MeetingsContext.Meetings + MeetingGroups',
      diagnostic:
        '[WARN] Custom CommandBase marker resolved; CommandWithoutValidator remains project debt.',
      diagnosticTone: 'warning',
    },
    markdownExcerpt: `# modular-monolith-with-ddd — CqrsLens 0.9.0 Snapshot
- **Projects Scanned**: 47
- **CQRS Requests**: 105 (105 handlers linked via custom command/query markers)
- **Pipeline Behaviors**: 0 registered
- **EF Core Contexts**: 4 module DbContexts
- **Architecture Checks**: 0 errors / 205 warnings
- **Warnings**: 71 CommandWithoutValidator · 62 OrphanNotification · 54 UnreachableRequest · 18 UnpublishedNotification
- **Snapshot**: text scanner · 2026-11-02`,
  },
  {
    id: 'ardalis-clean-arch',
    owner: 'ardalis/',
    repo: 'CleanArchitecture',
    githubUrl: 'https://github.com/ardalis/CleanArchitecture',
    architectureStyle: 'Core / UseCases / Infrastructure / FastEndpoints Web',
    mediatorStack: 'MediatR (Ardalis.SharedKernel) + FastEndpoints Validators',
    projects: 22,
    requests: 23,
    handlers: 23,
    validators: 21,
    behaviors: 3,
    dbContexts: 3,
    findingsSummary: '0 errors / 38 warnings',
    reportNote: 'FastEndpoints validators are visible but report as orphan relative to CQRS contracts',
    nodes: [
      { id: 'web', label: 'NimblePros.Sample.Web (FastEndpoints)', role: 'presentation', x: 30, y: 24, w: 240 },
      { id: 'infra', label: 'NimblePros.Sample.Infrastructure', role: 'infrastructure', x: 300, y: 24, w: 230 },
      { id: 'usecases', label: 'NimblePros.Sample.UseCases', role: 'application', x: 165, y: 106, w: 215 },
      { id: 'core', label: 'NimblePros.Sample.Core', role: 'domain', x: 180, y: 184, w: 185 },
    ],
    edges: [
      { fromX: 150, fromY: 60, toX: 240, toY: 106 },
      { fromX: 270, fromY: 42, toX: 300, toY: 42 },
      { fromX: 415, fromY: 60, toX: 315, toY: 106 },
      { fromX: 415, fromY: 60, toX: 325, toY: 184 },
      { fromX: 272, fromY: 142, toX: 272, toY: 184 },
    ],
    featuredSlice: {
      contract: 'CreateContributorCommand : ICommand<Result<ContributorId>>',
      kind: 'Command',
      dispatch: 'POST /Contributors · Web/Contributors/Create.cs:15',
      validator:
        'None linked — 21 FastEndpoints validators target request DTOs and report OrphanValidator',
      pipeline: '3 behaviors in scan order (LoggingBehavior, CachingBehavior)',
      handler: 'CreateContributorHandler · UseCases/Contributors/Create/CreateContributorHandler.cs:5',
      persistence: 'IRepository<Contributor> → AppDbContext.Contributors',
      diagnostic:
        '[WARN] Handler and dispatch linked. FastEndpoints validators target request DTOs, not the CQRS contract.',
      diagnosticTone: 'warning',
    },
    markdownExcerpt: `# ardalis/CleanArchitecture — CqrsLens 0.9.0 Snapshot
- **Projects Scanned**: 22
- **CQRS Requests**: 23 (23 handlers linked)
- **Validators**: 21 discovered — all 21 report OrphanValidator against CQRS contracts
- **Pipeline Behaviors**: 3 (recorded in scan order)
- **EF Core Contexts**: 3
- **Architecture Checks**: 0 errors / 38 warnings
- **Warnings**: 21 OrphanValidator · 13 CommandWithoutValidator · 4 UnpublishedNotification
- **Snapshot**: text scanner · 2026-11-02`,
  },
  {
    id: 'martinothamar-mediator',
    owner: 'martinothamar/',
    repo: 'Mediator (samples)',
    githubUrl: 'https://github.com/martinothamar/Mediator',
    architectureStyle: 'Source-Generated High-Performance CQRS Samples',
    mediatorStack: 'martinothamar/Mediator (ValueTask ICommandHandler / IQueryHandler)',
    projects: 24,
    requests: 15,
    handlers: 15,
    validators: 1,
    behaviors: 9,
    dbContexts: 0,
    findingsSummary: '0 errors / 12 warnings',
    reportNote: 'Source-generated contracts mapped without running the C# source generator',
    nodes: [
      { id: 'asp', label: 'ASPNET_Core_CleanArchitecture.Api', role: 'presentation', x: 35, y: 26, w: 235 },
      { id: 'infra', label: 'ASPNET_Core_CleanArchitecture.Infra', role: 'infrastructure', x: 300, y: 26, w: 230 },
      { id: 'app', label: 'ASPNET_Core_CleanArchitecture.App', role: 'application', x: 155, y: 108, w: 235 },
      { id: 'dom', label: 'ASPNET_Core_CleanArchitecture.Domain', role: 'domain', x: 165, y: 184, w: 220 },
    ],
    edges: [
      { fromX: 155, fromY: 62, toX: 245, toY: 108 },
      { fromX: 410, fromY: 62, toX: 305, toY: 108 },
      { fromX: 272, fromY: 144, toX: 272, toY: 184 },
    ],
    featuredSlice: {
      contract: 'AddTodoItem : ICommand<TodoItem>',
      kind: 'Command',
      dispatch:
        'POST /api/todos · TodoApi.cs:25-30 (passes a mapped local, so dispatch is not proven)',
      validator: 'AddTodoItemValidator (invoked inside the request via IValidate)',
      pipeline: '9 sample behaviors recorded globally in scan order',
      handler: 'TodoItemCommandHandler · AspNetCoreSample.Application/Todos/AddTodoItem.cs:32',
      persistence: 'ITodoItemRepository (sample repository; no DbContext discovered)',
      diagnostic:
        '[WARN] Handler and validator linked; Send(addTodo) uses a mapped local, so UnreachableRequest is reported.',
      diagnosticTone: 'warning',
    },
    markdownExcerpt: `# martinothamar/Mediator (samples) — CqrsLens 0.9.0 Snapshot
- **Projects Scanned**: 24 sample applications
- **CQRS Requests**: 15 (15 handlers linked, 1 validator)
- **Pipeline Behaviors**: 9 (recorded in scan order)
- **EF Core Contexts**: 0 discovered
- **Architecture Checks**: 0 errors / 12 warnings
- **Warnings**: 5 UnreachableRequest · 4 UnpublishedNotification · 2 CommandWithoutValidator · 1 OrphanNotification
- **Reachability Note**: mapped locals passed to Send/Publish are not treated as proven dispatch call sites
- **Snapshot**: text scanner · 2026-11-02`,
  },
] as const;
