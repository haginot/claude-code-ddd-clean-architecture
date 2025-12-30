# Ubiquitous Language Dictionary

This document defines the domain vocabulary used throughout the codebase. All team members and AI assistants should use these terms consistently in code, documentation, and communication.

## How to Use This Document

1. **Before coding**: Check this document for the correct term
2. **During code review**: Verify terms match this dictionary
3. **When discovering new concepts**: Add them here first
4. **In discussions**: Use only these terms to avoid confusion

---

## Core Domain Concepts

### General DDD Terms

| Term | Definition | Example |
|------|------------|---------|
| **Entity** | An object with a distinct identity that runs through time | Order, Customer, Product |
| **Value Object** | An immutable object without identity, defined by its attributes | Money, Email, Address |
| **Aggregate** | A cluster of entities and value objects with a root entity | Order (root) + OrderItems |
| **Aggregate Root** | The entry point to an aggregate; only object accessible from outside | Order in Order aggregate |
| **Domain Event** | A record of something significant that happened in the domain | OrderCreated, PaymentProcessed |
| **Repository** | An abstraction for persisting and retrieving aggregates | OrderRepository |
| **Domain Service** | Logic that doesn't belong to a single entity | PricingService |

---

## Bounded Contexts

> Define your bounded contexts below. Add a section for each context.

### [Example Context Name]

> Replace with your actual context

| Term | Definition | Related Terms |
|------|------------|---------------|
| **Term1** | Definition of Term1 | Related terms |
| **Term2** | Definition of Term2 | Related terms |

#### Aggregates

| Aggregate | Root Entity | Contains | Invariants |
|-----------|-------------|----------|------------|
| [Aggregate Name] | [Root] | [Entities, Value Objects] | [Business rules] |

#### Domain Events

| Event | Trigger | Data |
|-------|---------|------|
| [EventName]Event | When [action] | [Fields] |

---

## Context Relationships

> Document how bounded contexts communicate

| Source Context | Target Context | Relationship Type | Notes |
|----------------|----------------|-------------------|-------|
| [Context A] | [Context B] | Customer-Supplier / Conformist / ACL | [Notes] |

---

## Anti-Corruption Layer Terms

> Terms used when integrating with external systems

| External Term | Internal Term | Notes |
|---------------|---------------|-------|
| [External name] | [Our name] | [Mapping notes] |

---

## Template for Adding New Terms

When adding a new term, use this template:

```markdown
### [Term Name]

**Context**: [Which bounded context]
**Definition**: [Clear, concise definition]
**Type**: Entity / Value Object / Aggregate / Domain Event / Domain Service
**Invariants**: [Business rules this term must satisfy]
**Related Terms**: [Other terms this relates to]
**Example**: [Concrete example]
```

---

## Version History

| Date | Change | Author |
|------|--------|--------|
| YYYY-MM-DD | Initial creation | [Name] |
