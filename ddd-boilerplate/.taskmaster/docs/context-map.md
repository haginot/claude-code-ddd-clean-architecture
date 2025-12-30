# Context Map

This document defines the bounded contexts and their relationships within the project.

## Bounded Contexts

### 1. [Context Name]

**Description:** [Brief description of the context's responsibility]

**Domain:**
- Core Domain / Supporting Domain / Generic Domain

**Key Aggregates:**
- [Aggregate 1]
- [Aggregate 2]

**Team Ownership:** [Team Name]

---

## Context Relationships

```
┌─────────────────┐           ┌─────────────────┐
│  Context A      │  U/D      │  Context B      │
│  (Upstream)     │──────────▶│  (Downstream)   │
└─────────────────┘           └─────────────────┘
        │
        │ Published Language
        ▼
┌─────────────────┐
│  Context C      │
│  (Conformist)   │
└─────────────────┘
```

### Relationship Types

| Upstream | Downstream | Type | Description |
|----------|------------|------|-------------|
| [Context A] | [Context B] | Customer-Supplier | [Description] |
| [Context A] | [Context C] | Conformist | [Description] |

---

## Integration Patterns

### Anti-Corruption Layer (ACL)
Used between contexts to translate models and protect domain integrity.

**Location:** `src/[context]/infrastructure/acl/`

### Shared Kernel
Shared domain concepts between contexts.

**Location:** `src/shared/`

### Published Language
Standard format for inter-context communication.

**Format:** JSON/Events
**Schema Location:** `src/shared/contracts/`

---

## Context Communication

### Synchronous
- REST APIs between contexts
- Direct method calls (same process)

### Asynchronous
- Domain Events via message broker
- Event Sourcing patterns

---

## Guidelines

1. **Minimize Coupling:** Prefer event-driven communication
2. **Protect Boundaries:** Always use ACL when integrating external contexts
3. **Ubiquitous Language:** Each context has its own language
4. **Team Alignment:** One team per bounded context when possible

---

**Last Updated:** [Date]
