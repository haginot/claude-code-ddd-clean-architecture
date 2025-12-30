/**
 * Shared Domain Kernel
 * 
 * This module exports the base classes and interfaces for building
 * domain models following DDD and Clean Architecture principles.
 */

// Base classes
export { Entity } from './Entity.js';
export { ValueObject } from './ValueObject.js';
export { AggregateRoot } from './AggregateRoot.js';

// Domain Events
export {
  type DomainEvent,
  BaseDomainEvent,
  type EventPublisher,
  type EventHandler,
} from './DomainEvent.js';

// Repository
export {
  type Repository,
  type UnitOfWork,
  type PaginatedResult,
} from './Repository.js';
