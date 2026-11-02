export type RuleSeverity = 'error' | 'warning';
export type RuleCategory =
  | 'CQRS Wiring'
  | 'Clean Architecture Layers'
  | 'Validation & Hygiene'
  | 'Reachability & Events';

export interface ArchitectureRuleDoc {
  id: string;
  severity: RuleSeverity;
  category: RuleCategory;
  summary: string;
  rationale: string;
  configSnippet: string;
  violationTitle: string;
  violationCode: string;
  resolutionTitle: string;
  resolutionCode: string;
}

export const ARCHITECTURE_RULES: readonly ArchitectureRuleDoc[] = [
  {
    id: 'MissingHandler',
    severity: 'error',
    category: 'CQRS Wiring',
    summary: 'A discovered CQRS command or query has zero linked handlers.',
    rationale:
      'MediatR, Mediator, and Wolverine resolve handlers dynamically through dependency injection at runtime. The C# compiler passes a request contract with no handler, resulting in an unhandled InvalidOperationException in production when the endpoint is hit.',
    configSnippet: `{
  "rules": {
    "MissingHandler": "error"
  }
}`,
    violationTitle: 'Contract declared without a matching IRequestHandler<T, R>',
    violationCode: `// Orders/Commands/CancelOrder/CancelOrderCommand.cs
public sealed record CancelOrderCommand(Guid OrderId, string Reason)
    : IRequest<Result>;

// No class implements IRequestHandler<CancelOrderCommand, Result>`,
    resolutionTitle: 'Implement a single handler or delete the dead request contract',
    resolutionCode: `public sealed class CancelOrderCommandHandler(ShopDbContext db)
    : IRequestHandler<CancelOrderCommand, Result>
{
    public async Task<Result> Handle(CancelOrderCommand cmd, CancellationToken ct)
    {
        var order = await db.Orders.FindAsync([cmd.OrderId], ct);
        order?.Cancel(cmd.Reason);
        await db.SaveChangesAsync(ct);
        return Result.Success();
    }
}`,
  },
  {
    id: 'MultipleHandlers',
    severity: 'error',
    category: 'CQRS Wiring',
    summary: 'More than one handler targets the same request contract.',
    rationale:
      'Unlike domain notifications (fan-out), a CQRS Command or Query expects deterministic 1-to-1 dispatch. Registering two handlers for the same request causes DI containers to silently pick the last-registered assembly type or throw ambiguity exceptions.',
    configSnippet: `{
  "rules": {
    "MultipleHandlers": "error"
  }
}`,
    violationTitle: 'Two handlers bind to CreateInvoiceCommand across modules',
    violationCode: `public sealed class CreateInvoiceHandler
    : IRequestHandler<CreateInvoiceCommand, Guid> { /* ... */ }

// Leftover refactor copy in Billing.Legacy:
public sealed class LegacyCreateInvoiceHandler
    : IRequestHandler<CreateInvoiceCommand, Guid> { /* ... */ }`,
    resolutionTitle: 'Keep one request handler; use INotification for multi-subscriber fan-out',
    resolutionCode: `// Primary write handler:
public sealed class CreateInvoiceHandler
    : IRequestHandler<CreateInvoiceCommand, Guid> { /* ... */ }

// Side-effects become explicit notification handlers:
public sealed class InvoiceCreatedAuditHandler
    : INotificationHandler<InvoiceCreatedNotification> { /* ... */ }`,
  },
  {
    id: 'LayerViolation',
    severity: 'error',
    category: 'Clean Architecture Layers',
    summary: 'A Domain project references Infrastructure, Api, Web, or UI.',
    rationale:
      'The Domain layer holds pure enterprise invariants, value objects, and domain events. Referencing Infrastructure or Web couples business logic to EF Core providers, HTTP transports, or cloud SDKs.',
    configSnippet: `{
  "rules": {
    "LayerViolation": "error"
  }
}`,
    violationTitle: 'Domain .csproj references Infrastructure directly',
    violationCode: `<!-- src/Ordering.Domain/Ordering.Domain.csproj -->
<ItemGroup>
  <ProjectReference Include="..\\Ordering.Infrastructure\\Ordering.Infrastructure.csproj" />
</ItemGroup>`,
    resolutionTitle: 'Invert the dependency so Infrastructure depends inward on Domain',
    resolutionCode: `<!-- src/Ordering.Domain/Ordering.Domain.csproj -->
<!-- Zero outward ProjectReference edges -->

<!-- src/Ordering.Infrastructure/Ordering.Infrastructure.csproj -->
<ItemGroup>
  <ProjectReference Include="..\\Ordering.Domain\\Ordering.Domain.csproj" />
  <ProjectReference Include="..\\Ordering.Application\\Ordering.Application.csproj" />
</ItemGroup>`,
  },
  {
    id: 'ApplicationLayerViolation',
    severity: 'error',
    category: 'Clean Architecture Layers',
    summary: 'An Application project references Infrastructure, Api, Web, or UI.',
    rationale:
      'Application orchestrates use cases against abstractions (e.g. IApplicationDbContext, IEmailSender). Referencing Infrastructure or Api leaks SQL adapters, Redis clients, or ASP.NET Core controllers into use-case slices.',
    configSnippet: `{
  "rules": {
    "ApplicationLayerViolation": "error"
  }
}`,
    violationTitle: 'Application references concrete Infrastructure project',
    violationCode: `<!-- src/SampleShop.Application/SampleShop.Application.csproj -->
<ItemGroup>
  <ProjectReference Include="..\\SampleShop.Domain\\SampleShop.Domain.csproj" />
  <ProjectReference Include="..\\SampleShop.Infrastructure\\SampleShop.Infrastructure.csproj" />
</ItemGroup>`,
    resolutionTitle: 'Define port interfaces in Application and implement them in Infrastructure',
    resolutionCode: `// SampleShop.Application/Common/Interfaces/IShopDbContext.cs
public interface IShopDbContext
{
    DbSet<Order> Orders { get; }
    Task<int> SaveChangesAsync(CancellationToken ct);
}

// SampleShop.Infrastructure implements IShopDbContext and registers it in DI.`,
  },
  {
    id: 'CircularProjectDependency',
    severity: 'error',
    category: 'Clean Architecture Layers',
    summary: 'A dependency cycle exists in the resolved .csproj reference graph.',
    rationale:
      'Cyclic project references break Clean Architecture DAGs, prevent incremental compilation, and indicate tangled module boundaries.',
    configSnippet: `{
  "rules": {
    "CircularProjectDependency": "error"
  }
}`,
    violationTitle: 'Mutual reference cycle between Billing and Inventory projects',
    violationCode: `Billing.Application -> Inventory.Contracts -> Billing.Application`,
    resolutionTitle: 'Extract shared integration events into a leaf Contracts or SharedKernel project',
    resolutionCode: `Billing.Application   -> Shared.IntegrationEvents
Inventory.Application -> Shared.IntegrationEvents`,
  },
  {
    id: 'CommandWithoutValidator',
    severity: 'warning',
    category: 'Validation & Hygiene',
    summary: 'A state-mutating Command has no FluentValidation or FastEndpoints validator.',
    rationale:
      'Commands mutate persistent state. When teams rely on ValidationBehavior<TRequest, TResponse> in the mediator pipeline, omitting AbstractValidator<TCommand> lets unvalidated payloads reach domain entities or EF Core.',
    configSnippet: `{
  "rules": {
    "CommandWithoutValidator": "warning"
  }
}`,
    violationTitle: 'Command mutates state with no linked AbstractValidator<T>',
    violationCode: `public sealed record UpdateCreditLimitCommand(Guid CustomerId, decimal NewLimit)
    : IRequest<Unit>;

// Missing validator allows negative or unbounded credit limits into handler`,
    resolutionTitle: 'Add a strongly-typed FluentValidation or FastEndpoints validator',
    resolutionCode: `public sealed class UpdateCreditLimitCommandValidator
    : AbstractValidator<UpdateCreditLimitCommand>
{
    public UpdateCreditLimitCommandValidator()
    {
        RuleFor(x => x.CustomerId).NotEmpty();
        RuleFor(x => x.NewLimit).GreaterThanOrEqualTo(0m).LessThanOrEqualTo(250_000m);
    }
}`,
  },
  {
    id: 'OrphanValidator',
    severity: 'warning',
    category: 'Validation & Hygiene',
    summary: 'A validator targets a type that matches no discovered CQRS request.',
    rationale:
      'Often left behind when a Command is renamed or deleted, or mistakenly bound to an HTTP DTO instead of the dispatched Command that traverses ValidationBehavior.',
    configSnippet: `{
  "rules": {
    "OrphanValidator": "warning"
  }
}`,
    violationTitle: 'Validator targets an obsolete DTO instead of the dispatched Command',
    violationCode: `// Endpoint dispatches CreateOrderCommand, not CreateOrderRequestDto:
public sealed class CreateOrderRequestDtoValidator
    : AbstractValidator<CreateOrderRequestDto> { /* never invoked by pipeline! */ }`,
    resolutionTitle: 'Bind the validator directly to the CQRS request contract (or delete dead code)',
    resolutionCode: `public sealed class CreateOrderCommandValidator
    : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderCommandValidator()
    {
        RuleFor(x => x.Lines).NotEmpty();
    }
}`,
  },
  {
    id: 'OrphanNotification',
    severity: 'warning',
    category: 'Reachability & Events',
    summary: 'An INotification or IDomainEvent has zero notification handlers.',
    rationale:
      'Publishing a domain event that nobody subscribes to either signals an incomplete feature slice (missing email, outbox, or projection handler) or dead event allocations.',
    configSnippet: `{
  "rules": {
    "OrphanNotification": "warning"
  }
}`,
    violationTitle: 'Domain event published without any INotificationHandler<T>',
    violationCode: `public sealed record OrderShippedNotification(Guid OrderId, DateTimeOffset ShippedAt)
    : INotification;

// Published in ShipOrderCommandHandler, but 0 handlers subscribe`,
    resolutionTitle: 'Wire the intended subscriber or remove the unused event',
    resolutionCode: `public sealed class SendShipmentTrackingEmailHandler
    : INotificationHandler<OrderShippedNotification>
{
    public Task Handle(OrderShippedNotification evt, CancellationToken ct) =>
        /* dispatch customer tracking email */;
}`,
  },
  {
    id: 'UnreachableRequest',
    severity: 'warning',
    category: 'Reachability & Events',
    summary: 'A request has a handler, but no production Send() call site dispatches it.',
    rationale:
      'Identifies dead vertical slices that remain in Application after controller or Minimal API endpoints are deprecated, reducing maintenance surface and misleading test coverage.',
    configSnippet: `{
  "rules": {
    "UnreachableRequest": "warning"
  }
}`,
    violationTitle: 'Slice has request + handler, but zero production dispatch call sites',
    violationCode: `// ExportLegacyXmlQuery + ExportLegacyXmlQueryHandler exist in Application,
// while LegacyReportsController was deleted two sprints ago.`,
    resolutionTitle: 'Connect an endpoint Send() call site or retire the dead vertical slice',
    resolutionCode: `app.MapGet("/api/reports/export", (ISender sender, CancellationToken ct) =>
    sender.Send(new ExportReportQuery(), ct));`,
  },
  {
    id: 'UnpublishedNotification',
    severity: 'warning',
    category: 'Reachability & Events',
    summary: 'A domain event has handlers, but no production Publish() site emits it.',
    rationale:
      'Catches broken side-effect chains where a developer wrote the notification handler (e.g. cache invalidation or audit log) but forgot to call mediator.Publish() or entity.AddDomainEvent() in the write slice.',
    configSnippet: `{
  "rules": {
    "UnpublishedNotification": "warning"
  }
}`,
    violationTitle: 'Subscriber waits for an event that is never emitted in production code',
    violationCode: `public sealed class InvalidateProductCacheHandler
    : INotificationHandler<ProductPriceChangedNotification> { /* ... */ }

// UpdateProductPriceCommandHandler mutates price without publishing the event!`,
    resolutionTitle: 'Emit the domain event inside the mutating command or entity method',
    resolutionCode: `product.ChangePrice(cmd.NewPrice);
await db.SaveChangesAsync(ct);
await publisher.Publish(new ProductPriceChangedNotification(product.Id, cmd.NewPrice), ct);`,
  },
  {
    id: 'AmbiguousProjectName',
    severity: 'warning',
    category: 'Clean Architecture Layers',
    summary: 'Duplicate project names make cross-folder reference resolution ambiguous.',
    rationale:
      'In multi-service monorepos with multiple Application.csproj or Domain.csproj files across folders, duplicate assembly/project names complicate static mapping, stack traces, and DI assembly scanning.',
    configSnippet: `{
  "rules": {
    "AmbiguousProjectName": "warning"
  }
}`,
    violationTitle: 'Two bounded contexts share identical leaf project names',
    violationCode: `services/billing/src/Application/Application.csproj
services/shipping/src/Application/Application.csproj`,
    resolutionTitle: 'Namespace project files with their bounded context prefix',
    resolutionCode: `services/billing/src/Billing.Application/Billing.Application.csproj
services/shipping/src/Shipping.Application/Shipping.Application.csproj`,
  },
] as const;
