# Project: DDD Boilerplate

This file provides guidance to Claude Code when working with this Domain-Driven Design (DDD) and Clean Architecture project.

## Project Overview

**Architecture**: Domain-Driven Design (DDD) + Clean Architecture
**Language**: TypeScript
**Runtime**: Node.js (>=18.0.0)

This project follows strict DDD and Clean Architecture principles to ensure maintainability, testability, and alignment with business requirements.

---

## Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────┐
│      Interface Layer (API/UI)       │  ← Adapters (Controllers, CLI, etc.)
├─────────────────────────────────────┤
│      Application Layer              │  ← Use Cases, Commands, Queries
├─────────────────────────────────────┤
│      Domain Layer                   │  ← Business Logic (Entities, Aggregates, Value Objects)
├─────────────────────────────────────┤
│      Infrastructure Layer           │  ← Adapters (Database, External APIs)
└─────────────────────────────────────┘
```

### Dependency Rule

**CRITICAL**: Dependencies MUST point inward only:

```
Interface → Application → Domain
     ↓           ↓          ↑
Infrastructure → (implements Domain interfaces)
```

- ✅ Domain layer has ZERO dependencies on outer layers
- ✅ Application layer depends on Domain interfaces
- ✅ Infrastructure implements Domain interfaces
- ❌ Domain NEVER imports from Application/Infrastructure/Interface

---

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
    │   ├── [Aggregate].ts     # Aggregate Root
    │   ├── [Entity].ts        # Entity
    │   ├── [ValueObject].ts   # Value Object
    │   ├── [Repository].ts    # Repository Interface
    │   └── events/
    │       └── [Event].ts     # Domain Events
    ├── application/            # Application Layer
    │   ├── commands/
    │   │   └── [Command].ts
    │   ├── queries/
    │   │   └── [Query].ts
    │   └── handlers/
    │       └── [Handler].ts
    ├── infrastructure/         # Infrastructure Layer
    │   ├── [Repository]Impl.ts
    │   ├── mappers/
    │   └── models/
    └── interface/              # Interface Layer
        └── [Controller].ts
```

---

## Code Style Guidelines

### Entity Rules

```typescript
// ✅ GOOD: Rich domain model with behavior
export class Order extends AggregateRoot<OrderId> {
  private constructor(
    id: OrderId,
    private items: OrderItem[],
    private status: OrderStatus
  ) {
    super(id);
  }

  static create(customerId: CustomerId, items: OrderItem[]): Order {
    if (items.length === 0) {
      throw new InvalidOrderError("Order must have at least one item");
    }
    const order = new Order(OrderId.generate(), items, OrderStatus.Pending);
    order.addDomainEvent(new OrderCreatedEvent(order.id));
    return order;
  }

  addItem(item: OrderItem): void {
    if (this.status !== OrderStatus.Pending) {
      throw new InvalidOrderError("Cannot modify confirmed order");
    }
    this.items.push(item);
  }

  confirm(): void {
    this.validateOrderCanBeConfirmed();
    this.status = OrderStatus.Confirmed;
    this.addDomainEvent(new OrderConfirmedEvent(this.id));
  }
}

// ❌ BAD: Anemic domain model (just data)
export class Order {
  id: string;
  items: OrderItem[];
  status: string;
}
```

**Entity Best Practices**:
- ✅ Entities MUST have unique identity
- ✅ Use private constructors + factory methods
- ✅ Implement business logic as methods
- ✅ Validate invariants in methods
- ✅ Publish domain events for state changes
- ❌ NEVER create anemic entities (data-only)

### Value Object Rules

```typescript
// ✅ GOOD: Immutable value object with validation
export class Email extends ValueObject<{ value: string }> {
  private constructor(props: { value: string }) {
    super(props);
  }

  static create(email: string): Email {
    if (!Email.isValid(email)) {
      throw new InvalidEmailError(`Invalid email: ${email}`);
    }
    return new Email({ value: email });
  }

  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  get value(): string {
    return this.props.value;
  }

  get domain(): string {
    return this.props.value.split('@')[1];
  }
}

// ❌ BAD: Mutable value object without validation
export class Email {
  value: string; // Can be changed!
}
```

**Value Object Best Practices**:
- ✅ Value objects MUST be immutable
- ✅ Equality based on ALL attributes
- ✅ Include validation in factory method
- ✅ Small and focused
- ✅ Implement meaningful methods

### Repository Pattern

```typescript
// ✅ GOOD: Repository interface in domain layer
// File: src/[context]/domain/OrderRepository.ts
export interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: OrderId): Promise<Order | null>;
  findByCustomerId(customerId: CustomerId): Promise<Order[]>;
  findPendingOrders(): Promise<Order[]>;
}

// ✅ GOOD: Implementation in infrastructure layer
// File: src/[context]/infrastructure/SqlOrderRepository.ts
export class SqlOrderRepository implements OrderRepository {
  constructor(private readonly db: Database) {}

  async save(order: Order): Promise<void> {
    const model = OrderMapper.toModel(order);
    await this.db.save(model);
  }

  async findById(id: OrderId): Promise<Order | null> {
    const model = await this.db.findOne({ id: id.value });
    return model ? OrderMapper.toDomain(model) : null;
  }
}

// ❌ BAD: Repository returning DTOs or database models
export interface OrderRepository {
  findById(id: string): Promise<OrderDto>; // ❌ Should return Order entity
}
```

**Repository Best Practices**:
- ✅ Repository interfaces in domain layer
- ✅ Implementations in infrastructure layer
- ✅ Return domain objects, NEVER DTOs or database models
- ✅ Use domain-specific query methods
- ✅ Repository works with Aggregate Roots only

### Domain Events

```typescript
// ✅ GOOD: Immutable domain event with past tense
export class OrderConfirmedEvent implements DomainEvent {
  readonly occurredAt: Date;
  
  constructor(
    readonly orderId: OrderId,
    readonly customerId: CustomerId,
    readonly totalAmount: Money
  ) {
    this.occurredAt = new Date();
  }
}

// ❌ BAD: Mutable event with present tense
export class ConfirmOrder { // Should be OrderConfirmed
  orderId: string; // Can be changed!
}
```

**Domain Event Best Practices**:
- ✅ Events MUST be immutable
- ✅ Use past tense naming (OrderCreated, not CreateOrder)
- ✅ Include all necessary data
- ✅ Publish through application layer
- ✅ Include timestamp

### Use Cases (Application Layer)

```typescript
// ✅ GOOD: Use case orchestrates domain objects
export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(command: CreateOrderCommand): Promise<CreateOrderResponse> {
    // 1. Create domain objects
    const customerId = CustomerId.create(command.customerId);
    const items = command.items.map(item => 
      OrderItem.create(
        ProductId.create(item.productId),
        Quantity.create(item.quantity),
        Money.create(item.price, Currency.USD)
      )
    );

    // 2. Use domain logic
    const order = Order.create(customerId, items);

    // 3. Persist through repository
    await this.orderRepository.save(order);

    // 4. Publish events
    for (const event of order.domainEvents) {
      await this.eventPublisher.publish(event);
    }

    return new CreateOrderResponse(order.id.value);
  }
}

// ❌ BAD: Use case contains business logic
export class CreateOrderUseCase {
  async execute(command: CreateOrderCommand): Promise<void> {
    // ❌ Business logic should be in domain
    if (command.items.length === 0) {
      throw new Error("Order must have items");
    }
    const total = command.items.reduce((sum, item) => sum + item.price, 0);
    // ...
  }
}
```

**Use Case Best Practices**:
- ✅ Orchestrate domain objects, don't implement business logic
- ✅ Handle transactions
- ✅ Publish domain events
- ✅ Return DTOs, not domain objects
- ✅ One use case = one business workflow

---

## Development Commands

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Run tests
npm test
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:coverage

# Lint
npm run lint
npm run lint:fix

# Type check
npm run typecheck
```

---

## Critical Rules

### NEVER

- ❌ NEVER expose database concerns to domain layer
- ❌ NEVER create anemic domain models (data without behavior)
- ❌ NEVER have cross-aggregate transactions in single operation
- ❌ NEVER let technical concerns drive domain design
- ❌ NEVER skip ubiquitous language development
- ❌ NEVER create large, monolithic aggregates
- ❌ NEVER use domain entities in API responses (use DTOs)
- ❌ NEVER import from outer layers in domain code

### ALWAYS

- ✅ ALWAYS use ubiquitous language consistently
- ✅ ALWAYS respect bounded context boundaries
- ✅ ALWAYS validate invariants in domain objects
- ✅ ALWAYS publish domain events for state changes
- ✅ ALWAYS use dependency injection at composition root
- ✅ ALWAYS write tests for domain logic first
- ✅ ALWAYS make value objects immutable
- ✅ ALWAYS use repository pattern for persistence

---

## Code Review Checklist

Before committing code, verify:

### Domain Layer
- [ ] Entities contain business logic, not just data
- [ ] Value objects are immutable
- [ ] Aggregates maintain their invariants
- [ ] Domain events are published for state changes
- [ ] No dependencies on outer layers
- [ ] Ubiquitous language is used consistently

### Application Layer
- [ ] Use cases orchestrate, don't implement business logic
- [ ] DTOs are used for input/output
- [ ] Domain events are published
- [ ] Dependencies are injected

### Infrastructure Layer
- [ ] Repositories return domain objects, not DTOs
- [ ] Database models are separate from domain entities
- [ ] Mapping between domain and persistence is clear

### Testing
- [ ] Domain logic has unit tests without mocks
- [ ] Use cases have integration tests with mocked repositories
- [ ] All tests pass

---

## Naming Conventions

### Files
- Entities: `[Name].ts` (e.g., `Order.ts`)
- Value Objects: `[Name].ts` (e.g., `Money.ts`, `OrderId.ts`)
- Domain Events: `[Name]Event.ts` (e.g., `OrderCreatedEvent.ts`)
- Repository Interfaces: `[Name]Repository.ts` (e.g., `OrderRepository.ts`)
- Repository Implementations: `[Name]RepositoryImpl.ts` or `Sql[Name]Repository.ts`
- Use Cases: `[Action][Entity]UseCase.ts` (e.g., `CreateOrderUseCase.ts`)
- Commands: `[Action][Entity]Command.ts` (e.g., `CreateOrderCommand.ts`)
- Queries: `[Action][Entity]Query.ts` (e.g., `GetOrderQuery.ts`)

### Classes
- Domain Events: Past tense (`OrderCreated`, `PaymentProcessed`)
- Commands: Imperative (`CreateOrder`, `ConfirmPayment`)
- Errors: `[Context]Error` (e.g., `InvalidOrderError`)

---

## Additional Resources

- [docs/ubiquitous-language.md](./docs/ubiquitous-language.md) - Domain vocabulary
- [docs/context-map.md](./docs/context-map.md) - Bounded context relationships

---

## Task Management with Task Master

This project integrates [Task Master](https://github.com/eyaltoledano/claude-task-master) for AI-powered task management aligned with DDD principles.

### Quick Start

```bash
# Initialize Task Master
npm run task:init

# Parse PRD and generate tasks
npm run task:parse

# List all tasks
npm run task:list

# Show next task to work on
npm run task:next
```

### Task Workflow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  1. PRD         │────▶│  2. Parse       │────▶│  3. Tasks       │
│  Creation       │     │  PRD            │     │  Generated      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  6. Complete    │◀────│  5. Validate    │◀────│  4. Implement   │
│  Task           │     │  Architecture   │     │  Task           │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

#### 1. PRD Creation
Write your requirements in `.taskmaster/docs/prd.txt`. Use the DDD PRD template at `.taskmaster/templates/ddd-prd-template.txt` for guidance.

#### 2. Task Generation
Ask the AI: "Can you parse my PRD at .taskmaster/docs/prd.txt?"

#### 3. Implementation
Follow DDD layer order:
1. **Domain Layer First** - Entities, Value Objects, Aggregates, Events
2. **Application Layer** - Use Cases, Commands, Queries
3. **Infrastructure Layer** - Repository implementations, External services
4. **Interface Layer** - Controllers, API endpoints

#### 4. Validation
Run architecture validation before completing: `npm run validate:layers`

#### 5. Completion
Mark task as complete and move to the next.

### Task-to-Layer Mapping

| Layer | Task Focus | Key Guidelines |
|-------|------------|----------------|
| Domain | Entities, Value Objects, Aggregates, Events | NO outer layer imports, pure business logic |
| Application | Use Cases, Commands, Queries | Orchestrate domain, handle transactions |
| Infrastructure | Repositories, External services | Implement domain interfaces |
| Interface | Controllers, DTOs, API endpoints | Handle HTTP, validate input |

### Common Commands

| Command | Description |
|---------|-------------|
| `npm run task:list` | List all tasks |
| `npm run task:next` | Show next task to work on |
| `npm run task:show -- <id>` | Show specific task |
| `npm run task:parse` | Parse PRD and generate tasks |
| `npm run task:complexity` | Generate complexity report |

### DDD-Aligned Task Implementation

When implementing a task:

1. **Check Task Layer** - Determine which architectural layer the task belongs to
2. **Review Dependencies** - Ensure prerequisite tasks are complete
3. **Follow Naming Conventions** - Use ubiquitous language
4. **Validate Architecture** - Run layer validation
5. **Publish Events** - Domain events for state changes
6. **Write Tests** - Domain layer tests don't need mocks

### Integration with Claude Flow

Task Master integrates with Claude Flow for automated workflows:

- Task status changes trigger architecture validation
- PRD updates regenerate tasks automatically
- Completed tasks trigger documentation updates

See `FLOW.md` for detailed flow configuration.

### Research Feature

Use Task Master's research for DDD guidance:

```
Research best practices for implementing [DDD pattern] in TypeScript
Research aggregate root design best practices
Research domain event handling patterns in Node.js
```

### Directory Structure

```
.taskmaster/
├── docs/
│   ├── prd.txt              # Main PRD file
│   └── context-map.md       # DDD context mapping
├── templates/
│   ├── ddd-prd-template.txt # DDD-specific PRD template
│   └── example_prd.txt      # Example PRD for reference
└── tasks/                    # Generated tasks
```

### Best Practices

1. **Start with Domain Layer** - Always implement domain objects first
2. **One Task, One Concern** - Keep tasks focused
3. **Use Ubiquitous Language** - Consistent naming from domain vocabulary
4. **Validate Continuously** - Run architecture checks frequently
5. **Document Changes** - Update context map and ubiquitous language

---

## ⚠️ Claude Code での安全なファイル探索

### 重要: MCP filesystem サーバーについて

このボイラープレートでは、**MCP `filesystem` サーバーは意図的に無効化**しています。

**理由:**
- `directory_tree` コマンドが `node_modules` を含む巨大なレスポンス（数百万トークン）を返す
- コンテキストウィンドウがオーバーフローし、セッションが使用不能になる
- Claude Code には組み込みのファイル操作ツールがあり、MCP filesystem は不要

### Claude Code 組み込みツール（推奨）

Claude Code CLI には以下の安全な組み込みツールがあります：

| ツール | 用途 | 説明 |
|--------|------|------|
| `Read` | ファイル読み取り | 単一ファイルの内容を取得 |
| `Write` | ファイル作成 | 新規ファイルを作成 |
| `Edit` | ファイル編集 | 既存ファイルを部分的に編集 |
| `MultiEdit` | 複数編集 | 1ファイル内の複数箇所を編集 |
| `LS` | ディレクトリ一覧 | `.gitignore` を尊重した安全なリスト |
| `Glob` | パターン検索 | ファイルパターンでの検索 |
| `Grep` | テキスト検索 | 正規表現でのコード検索 |
| `Bash` | コマンド実行 | シェルコマンドの実行 |

### 危険な操作を避ける

**❌ 絶対に使用禁止:**

```bash
# ❌ MCP filesystem の directory_tree（コンテキストオーバーフローの原因）
filesystem - directory_tree (MCP)

# ❌ プロジェクトルートでの無制限なリスト取得
filesystem - list_directory "/" (MCP)
```

**✅ 代わりに使うべき安全な操作:**

```bash
# ✅ 組み込み LS ツール
LS ./src

# ✅ パターンマッチング
Glob "src/**/*.ts"

# ✅ コード検索
Grep "class.*Entity"

# ✅ シェルコマンド（必要な場合）
Bash "find src -name '*.ts' -type f | head -20"
```

### コンテキストオーバーフローの症状と対処

**症状:**
```
API Error: 400 Input is too long for requested model.
```

または

```
⚠ Large MCP response (~3.8m tokens), this can fill up context quickly
```

**対処方法:**
1. 現在のセッションを終了（`/exit` または `Ctrl+C`）
2. 新しいセッションを開始（`claude`）
3. 問題の操作を避けて再実行

### MCP filesystem を有効にしたい場合

特別な理由で `filesystem` サーバーが必要な場合は、`.mcp.json` の `_disabled_servers` から `mcpServers` に移動してください。ただし、以下を厳守：

1. **ディレクトリを制限**: `["./src", "./tests", "./docs"]` のみ
2. **directory_tree は絶対に使用しない**
3. **list_directory は浅いディレクトリのみ**

### 大規模プロジェクトでの探索戦略

1. **段階的に探索**: ルートから一度に深く探索しない
2. **パターンで絞り込む**: `Glob "src/**/*.ts"` で特定のファイルタイプのみ
3. **小さいスコープで始める**: 特定のディレクトリから探索開始
4. **head で制限**: `Bash "find . -name '*.ts' | head -50"`

---

**Last Updated**: 2025-12-31
**Version**: 2.2.0
