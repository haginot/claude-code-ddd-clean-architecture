# Task Management with Task Master

This skill provides guidance for using Task Master to manage development tasks within a DDD/Clean Architecture project.

## Overview

Task Master is an AI-powered task management system that integrates with Claude Code to provide structured, PRD-based task generation and tracking. This skill helps you use Task Master effectively while maintaining DDD principles.

---

## Quick Start Commands

### Initialization
```
Initialize taskmaster-ai in my project
```

### Parsing PRD
```
Can you parse my PRD at .taskmaster/docs/prd.txt?
```

### Task Navigation
```
What's the next task I should work on?
Can you show me tasks 1, 3, and 5?
Can you list all pending tasks?
```

### Task Implementation
```
Can you help me implement task 3?
Can you expand task 4 into subtasks?
```

### Research (with Perplexity)
```
Research best practices for implementing repository pattern in TypeScript
Research domain event handling patterns in Node.js
```

---

## DDD-Aligned Task Workflow

### 1. PRD Creation
Start with a detailed PRD that follows DDD principles:

```
.taskmaster/docs/prd.txt
├── Bounded Context Definition
├── Ubiquitous Language
├── Functional Requirements by Layer
│   ├── Domain Layer
│   ├── Application Layer
│   ├── Infrastructure Layer
│   └── Interface Layer
└── Architecture Constraints
```

Use the template at `.taskmaster/templates/ddd-prd-template.txt` for guidance.

### 2. Task Generation
Parse the PRD to generate tasks:
```
Can you parse my PRD at .taskmaster/docs/prd.txt?
```

Task Master will create tasks organized by:
- Priority (domain layer first, then application, infrastructure, interface)
- Dependencies (foundational tasks before dependent ones)
- Complexity (simple tasks can be broken down)

### 3. Task Implementation Order

Follow DDD layering when implementing tasks:

```
1. Domain Layer Tasks (First)
   └── Value Objects → Entities → Aggregates → Domain Events

2. Application Layer Tasks (Second)
   └── Use Case interfaces → Command Handlers → Query Handlers

3. Infrastructure Layer Tasks (Third)
   └── Repository implementations → External service clients

4. Interface Layer Tasks (Last)
   └── Controllers → DTOs → API endpoints
```

### 4. Task Completion Checklist

Before marking a task as complete:
- [ ] Domain layer tests pass
- [ ] No architecture violations (`npm run validate:layers`)
- [ ] Domain events published for state changes
- [ ] Ubiquitous language used consistently
- [ ] Documentation updated if needed

---

## Task-to-Layer Mapping

### Domain Layer Tasks

Tasks targeting the domain layer should focus on:

| Task Type | Location | Naming |
|-----------|----------|--------|
| Entity | `src/[context]/domain/[Entity].ts` | PascalCase |
| Value Object | `src/[context]/domain/[Name].ts` | PascalCase |
| Aggregate | `src/[context]/domain/[Aggregate].ts` | PascalCase |
| Domain Event | `src/[context]/domain/events/[Name]Event.ts` | `[Entity][Action]Event` |
| Repository Interface | `src/[context]/domain/[Entity]Repository.ts` | `[Entity]Repository` |

**Key Guidelines:**
- NO imports from outer layers
- NO infrastructure concerns (database, HTTP, etc.)
- Focus on business logic and invariants
- Use factory methods over constructors
- Publish domain events for state changes

### Application Layer Tasks

Tasks targeting the application layer should focus on:

| Task Type | Location | Naming |
|-----------|----------|--------|
| Use Case | `src/[context]/application/[Action][Entity]UseCase.ts` | `[Action][Entity]UseCase` |
| Command | `src/[context]/application/commands/[Action][Entity]Command.ts` | `[Action][Entity]Command` |
| Query | `src/[context]/application/queries/[Action][Entity]Query.ts` | `[Get/List][Entity]Query` |
| Handler | `src/[context]/application/handlers/[Name]Handler.ts` | `[Name]Handler` |

**Key Guidelines:**
- Orchestrate domain objects, don't implement business logic
- Depend on domain interfaces, not implementations
- Handle transactions
- Publish domain events
- Return DTOs, not domain entities

### Infrastructure Layer Tasks

Tasks targeting the infrastructure layer should focus on:

| Task Type | Location | Naming |
|-----------|----------|--------|
| Repository Impl | `src/[context]/infrastructure/[Prefix][Entity]Repository.ts` | `Sql[Entity]Repository` |
| Mapper | `src/[context]/infrastructure/mappers/[Entity]Mapper.ts` | `[Entity]Mapper` |
| External Client | `src/[context]/infrastructure/[Service]Client.ts` | `[Service]Client` |

**Key Guidelines:**
- Implement domain interfaces
- Map between domain and persistence models
- Handle technical concerns (connections, retries)
- Never expose infrastructure types to domain

### Interface Layer Tasks

Tasks targeting the interface layer should focus on:

| Task Type | Location | Naming |
|-----------|----------|--------|
| Controller | `src/[context]/interface/[Entity]Controller.ts` | `[Entity]Controller` |
| DTO | `src/[context]/interface/dto/[Name]Dto.ts` | `[Name]Dto` |
| Presenter | `src/[context]/interface/presenters/[Name]Presenter.ts` | `[Name]Presenter` |

**Key Guidelines:**
- Handle HTTP concerns
- Validate input
- Map to/from DTOs
- Use Application layer services

---

## Common Task Patterns

### Pattern 1: Creating a New Aggregate

When a task involves creating a new aggregate:

1. **Create Value Objects** (if needed)
   ```
   Implement [ValueObject] with validation for [domain rules]
   ```

2. **Create Entity** (if aggregate has child entities)
   ```
   Implement [Entity] with [behaviors] and [invariants]
   ```

3. **Create Aggregate Root**
   ```
   Implement [Aggregate] aggregate root with factory method and domain events
   ```

4. **Create Repository Interface**
   ```
   Define [Aggregate]Repository interface in domain layer
   ```

5. **Create Domain Events**
   ```
   Implement [Aggregate]Created, [Aggregate]Updated events
   ```

### Pattern 2: Implementing a Use Case

When a task involves implementing a use case:

1. **Create Command/Query**
   ```
   Define [Action][Entity]Command with required data
   ```

2. **Create Use Case**
   ```
   Implement [Action][Entity]UseCase that orchestrates domain logic
   ```

3. **Create Response DTO**
   ```
   Define [Action][Entity]Response for use case output
   ```

4. **Wire Dependencies**
   ```
   Register use case in DI container
   ```

### Pattern 3: Adding an API Endpoint

When a task involves adding an API endpoint:

1. **Create Request DTO**
   ```
   Define [Action][Entity]Request with validation
   ```

2. **Create Response DTO**
   ```
   Define [Action][Entity]Response for API output
   ```

3. **Add Controller Method**
   ```
   Implement [method] in [Entity]Controller that calls use case
   ```

4. **Add Route**
   ```
   Register route: [METHOD] /api/v1/[entities]
   ```

---

## Integration with DDD Architecture

### Architecture Validation

After completing a task, validate architecture:

```bash
npm run validate:layers
```

This ensures:
- Domain layer has no outer layer imports
- Repository interfaces are in domain
- Implementations are in infrastructure

### Domain Events

Tasks that change state should include domain events:

```typescript
// In aggregate method
confirm(): void {
  this.validateCanBeConfirmed();
  this.status = Status.Confirmed;
  this.addDomainEvent(new EntityConfirmedEvent(this.id));
}
```

### Testing Strategy

| Layer | Test Type | Mocking |
|-------|-----------|---------|
| Domain | Unit | None (pure functions) |
| Application | Integration | Mock repositories |
| Infrastructure | Integration | Test database |
| Interface | E2E | Full stack |

---

## Research Commands

Use Task Master's research feature for DDD guidance:

### Pattern Research
```
Research best practices for implementing [DDD pattern] in TypeScript
```

### Context-Aware Research
```
Research [topic] for our [bounded context] implementation in src/[context]/
```

### Latest Updates
```
Research latest updates on [DDD concept] with examples
```

### Example Queries
```
Research aggregate root design best practices for event sourcing
Research value object implementation strategies in functional TypeScript
Research domain event handling patterns with eventual consistency
Research repository pattern with unit of work in TypeScript
```

---

## Tips for Effective Task Management

1. **Start with Domain Layer**
   - Always implement domain objects before use cases
   - Domain layer is the core of DDD

2. **One Task, One Concern**
   - Keep tasks focused on a single responsibility
   - Use subtasks for complex implementations

3. **Reference Ubiquitous Language**
   - Use terms from `docs/ubiquitous-language.md`
   - Maintain consistent naming across layers

4. **Validate Continuously**
   - Run `npm run validate:layers` frequently
   - Catch architecture violations early

5. **Document as You Go**
   - Update context map when adding new contexts
   - Add new terms to ubiquitous language

---

## Related Skills

- **DDD Architecture** (`.claude/skills/ddd-architecture/`)
- **Repository Generator** (`.claude/skills/repository-generator/`)
- **Domain Event Publisher** (`.claude/skills/domain-event-publisher/`)
- **Architecture Guardian** (`.claude/skills/architecture-guardian/`)

---

## Resources

- [Task Master Documentation](https://docs.task-master.dev/)
- [DDD Templates](`.taskmaster/templates/`)
- [Example PRD](`.taskmaster/templates/example_prd.txt`)
