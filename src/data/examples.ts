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
  parityNote: string;
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
    findingsSummary: '0 errors / 3 warnings',
    parityNote: '100% parity between --analysis text and --analysis roslyn',
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
      dispatch: 'TodoItems.cs (Minimal API EndpointGroupBase)',
      validator: 'CreateTodoItemCommandValidator (FluentValidation)',
      pipeline: 'UnhandledExceptionBehaviour -> AuthorizationBehaviour -> ValidationBehaviour -> PerformanceBehaviour',
      handler: 'CreateTodoItemCommandHandler',
      persistence: 'IApplicationDbContext.TodoItems + TodoItemCreatedEvent',
      diagnostic: '[PASS] Reachable endpoint, 1:1 handler, validator & domain event wired.',
    },
    markdownExcerpt: `# CleanArchitecture — Static Cartography
- **Projects Scanned**: 13 (4 src + 9 test/build)
- **CQRS Requests**: 11 (7 Commands, 4 Queries · 100% handler coverage)
- **Pipeline Behaviors**: 4 registered open-generic behaviors
- **EF Core Contexts**: ApplicationDbContext (TodoLists, TodoItems)
- **Findings**: 0 Errors · 3 Warnings (Commands intentionally without validator: DeleteTodoItem, DeleteTodoList, PurgeTodoLists)`,
  },
  {
    id: 'kgrzybek-modular-monolith',
    owner: 'kgrzybek/',
    repo: 'modular-monolith-with-ddd',
    githubUrl: 'https://github.com/kgrzybek/modular-monolith-with-ddd',
    architectureStyle: 'DDD Modular Monolith (5 Bounded Contexts)',
    mediatorStack: 'MediatR + Custom ICommand / IQuery Markers + EF Core',
    projects: 46,
    requests: 105,
    handlers: 105,
    validators: 5,
    behaviors: 0,
    dbContexts: 4,
    findingsSummary: '0 errors / 71 warnings',
    parityNote: 'Resolves custom ICommand<T> / IQuery<T> hierarchy across 46 projects without build',
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
      contract: 'CreateMeetingCommand : CommandBase<Guid>',
      kind: 'Command',
      dispatch: 'MeetingsController.CreateMeeting (POST /api/meetings/meetings)',
      validator: 'CreateMeetingCommandValidator',
      pipeline: 'UnitOfWorkCommandHandlerDecorator -> ValidationCommandHandlerDecorator',
      handler: 'CreateMeetingCommandHandler (Meetings.Application)',
      persistence: 'MeetingsContext.Meetings + MeetingCreatedDomainEvent',
      diagnostic: '[PASS] Custom CommandBase<TResult> inheritance chain resolved statically.',
    },
    markdownExcerpt: `# modular-monolith-with-ddd — Static Cartography
- **Projects Scanned**: 46 across Meetings, Administration, Payments, Registrations & UserAccess
- **CQRS Requests**: 105 discovered via custom ICommand / IQuery base types (105/105 handlers linked)
- **EF Core Contexts**: 4 isolated module DbContexts (MeetingsContext, AdministrationContext, PaymentsContext, UserAccessContext)
- **Findings**: 0 Layer Errors · 71 Warnings (primarily internal module commands validated inside DDD aggregates rather than FluentValidation)`,
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
    findingsSummary: '0 errors / 13 warnings',
    parityNote: 'Links FastEndpoints Validator<T> alongside Ardalis.SharedKernel ICommand<T>',
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
      contract: 'CreateContributorCommand : Ardalis.SharedKernel.ICommand<Result<int>>',
      kind: 'Command',
      dispatch: 'Create.cs (FastEndpoints POST /Contributors)',
      validator: 'CreateContributorValidator (FastEndpoints Validator<T>)',
      pipeline: 'LoggingBehavior<TRequest, TResponse>',
      handler: 'CreateContributorHandler (UseCases/Contributors/Create)',
      persistence: 'AppDbContext.Contributors (via IRepository<Contributor>)',
      diagnostic: '[PASS] Ardalis.SharedKernel marker & FastEndpoints validator matched.',
    },
    markdownExcerpt: `# ardalis/CleanArchitecture — Static Cartography
- **Projects Scanned**: 22 (Template + Sample Core/UseCases/Infrastructure/Web)
- **CQRS Requests**: 23 (100% linked to UseCases handlers)
- **Validators**: 21 (FastEndpoints & FluentValidation conventions)
- **EF Core Contexts**: 3 DbContexts mapped
- **Findings**: 0 Errors · 13 Warnings`,
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
    findingsSummary: '0 errors / 3 warnings',
    parityNote: 'Maps source-generated Mediator contracts without running C# source generators!',
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
      contract: 'AddTodo : Mediator.ICommand<TodoItemDto>',
      kind: 'Command',
      dispatch: 'TodosController.Post (POST /api/todos)',
      validator: 'TodoValidator : IPipelineBehavior<AddTodo, TodoItemDto>',
      pipeline: 'ErrorLoggingBehaviour -> MessageValidatorBehaviour (9 sample behaviors)',
      handler: 'AddTodoHandler : ICommandHandler<AddTodo, TodoItemDto>',
      persistence: 'ITodoRepository (In-memory sample store)',
      diagnostic: '[PASS] ValueTask source-generated Mediator handler linked statically.',
    },
    markdownExcerpt: `# martinothamar/Mediator (samples) — Static Cartography
- **Projects Scanned**: 24 sample applications (Clean Architecture, Minimal APIs, AOT, WPF)
- **CQRS Requests**: 15 (ICommand<T>, IQuery<T>, IStreamQuery<T>)
- **Pipeline Behaviors**: 9 IPipelineBehavior & StreamPipelineBehavior implementations
- **Zero-Build Note**: Maps Mediator.SourceGenerator contracts directly from .cs declarations without invoking source generation.`,
  },
] as const;
