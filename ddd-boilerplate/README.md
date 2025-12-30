# DDD Boilerplate

A Domain-Driven Design (DDD) and Clean Architecture boilerplate for TypeScript/Node.js projects, optimized for use with Claude Code.

## Features

- **Clean Architecture**: Four-layer architecture with clear dependency rules
- **DDD Patterns**: Entity, Value Object, Aggregate Root, Domain Event, Repository
- **Claude Code Integration**: CLAUDE.md, Skills, Hooks for automated guidance
- **Type Safety**: Full TypeScript support with strict mode
- **Testing Ready**: Jest configuration with separate unit/integration/e2e test suites

## Architecture

```
┌─────────────────────────────────────┐
│      Interface Layer (API/UI)       │  ← Controllers, CLI
├─────────────────────────────────────┤
│      Application Layer              │  ← Use Cases, Commands, Queries
├─────────────────────────────────────┤
│      Domain Layer                   │  ← Entities, Value Objects, Domain Events
├─────────────────────────────────────┤
│      Infrastructure Layer           │  ← Repositories, External Services
└─────────────────────────────────────┘
```

### Dependency Rule

Dependencies point **inward only**:
- Interface → Application → Domain
- Infrastructure → Domain (implements interfaces)
- ❌ Domain NEVER imports from outer layers

## Project Structure

```
src/
├── shared/                      # Shared Kernel
│   └── domain/
│       ├── Entity.ts           # Entity base class
│       ├── ValueObject.ts      # Value Object base class
│       ├── AggregateRoot.ts    # Aggregate Root base class
│       ├── DomainEvent.ts      # Domain Event interface
│       └── Repository.ts       # Repository interface
└── [context]/                   # Bounded Context
    ├── domain/                 # Domain Layer
    ├── application/            # Application Layer
    ├── infrastructure/         # Infrastructure Layer
    └── interface/              # Interface Layer

tests/
├── unit/                       # Domain layer tests
├── integration/                # Application layer tests
└── e2e/                        # End-to-end tests

.claude/
├── settings.json               # Hooks configuration
├── skills/
│   └── ddd-architecture/       # DDD skill
└── hooks/                      # Validation scripts
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Claude Code (optional, for AI-assisted development)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ddd-boilerplate

# Install dependencies
npm install

# Build the project
npm run build
```

### Development

```bash
# Run in development mode
npm run dev

# Type check
npm run typecheck

# Lint
npm run lint
npm run lint:fix
```

### Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Run with coverage
npm run test:coverage
```

## Creating a New Bounded Context

1. Create the context directory structure:

```bash
mkdir -p src/[context]/{domain,application,infrastructure,interface}
mkdir -p src/[context]/domain/events
mkdir -p src/[context]/application/{commands,queries,handlers}
mkdir -p src/[context]/infrastructure/mappers
```

2. Define your domain model:
   - Create entities and value objects in `domain/`
   - Define repository interfaces in `domain/`
   - Create domain events in `domain/events/`

3. Implement use cases in `application/`:
   - Create commands and queries
   - Implement handlers

4. Add infrastructure in `infrastructure/`:
   - Implement repositories
   - Add mappers for domain ↔ persistence conversion

5. Create API endpoints in `interface/`

## Claude Code Integration

This boilerplate includes Claude Code integration for AI-assisted development:

### CLAUDE.md

Project context and coding guidelines are defined in `CLAUDE.md`. Claude Code will automatically read this file to understand:
- Architecture principles
- Coding conventions
- Layer boundaries
- Naming conventions

### Hooks

Validation hooks automatically check:
- **Layer Dependencies**: Prevents domain layer from importing outer layers
- **Domain Events**: Validates event naming and structure
- **Naming Conventions**: Ensures consistent naming patterns
- **Task Architecture**: Validates task implementations follow DDD principles

### Skills

The DDD Architecture skill provides guidance for:
- Creating aggregates and entities
- Implementing repositories
- Publishing domain events
- Designing bounded contexts

## Task Master Integration

This project integrates [Task Master](https://github.com/eyaltoledano/claude-task-master) for AI-powered task management aligned with DDD principles.

### Quick Start

```bash
# Initialize Task Master
npm run task:init

# Parse PRD and generate tasks
npm run task:parse

# List all tasks
npm run task:list

# Show next task
npm run task:next
```

### Task Management Commands

| Command | Description |
|---------|-------------|
| `npm run task:init` | Initialize Task Master |
| `npm run task:parse` | Parse PRD and generate tasks |
| `npm run task:list` | List all tasks |
| `npm run task:next` | Show next task to work on |
| `npm run task:show -- <id>` | Show specific task(s) |
| `npm run task:complexity` | Generate complexity report |
| `npm run task:expand` | Expand task into subtasks |

### PRD Templates

DDD-specific PRD templates are available in `.taskmaster/templates/`:
- `ddd-prd-template.txt` - Comprehensive DDD PRD template
- `example_prd.txt` - Example PRD for Order Management bounded context

### Task Workflow

1. **Write PRD** - Create detailed requirements in `.taskmaster/docs/prd.txt`
2. **Parse PRD** - Generate tasks with `npm run task:parse`
3. **Implement** - Follow DDD layer order (Domain → Application → Infrastructure → Interface)
4. **Validate** - Run `npm run validate:layers` before completing
5. **Complete** - Mark task as done and move to next

See `CLAUDE.md` for detailed task management documentation.

## Documentation

- [Ubiquitous Language](./docs/ubiquitous-language.md) - Domain vocabulary
- [Context Map](./docs/context-map.md) - Bounded context relationships

## Best Practices

### Domain Layer

- ✅ Keep domain logic in entities and value objects
- ✅ Use factory methods for object creation
- ✅ Validate invariants in domain objects
- ✅ Publish domain events for state changes
- ❌ Never import from infrastructure or application layers

### Application Layer

- ✅ One use case per class
- ✅ Orchestrate domain objects, don't implement business logic
- ✅ Use DTOs for input/output
- ✅ Publish domain events through event publisher

### Infrastructure Layer

- ✅ Implement repository interfaces from domain layer
- ✅ Use mappers for domain ↔ persistence conversion
- ✅ Return domain objects, never database models

## License

MIT
