import { Entity } from './Entity.js';
import type { DomainEvent } from './DomainEvent.js';

/**
 * Base class for all Aggregate Roots in the domain.
 * 
 * An Aggregate Root is the entry point to an Aggregate - a cluster of
 * domain objects that can be treated as a single unit. The root is the
 * only object that external objects can hold references to.
 * 
 * Aggregate Roots:
 * - Are the only objects that can be directly accessed from repositories
 * - Protect business invariants of the entire aggregate
 * - Publish domain events for significant state changes
 * 
 * @template T - The type of the aggregate root's identifier
 */
export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: DomainEvent[] = [];
  private _version: number = 0;

  protected constructor(id: T, version: number = 0) {
    super(id);
    this._version = version;
  }

  /**
   * Returns all domain events that have been raised since the last clear.
   * These events should be published after the aggregate is persisted.
   */
  get domainEvents(): readonly DomainEvent[] {
    return [...this._domainEvents];
  }

  /**
   * Returns the current version of the aggregate.
   * Used for optimistic concurrency control.
   */
  get version(): number {
    return this._version;
  }

  /**
   * Adds a domain event to be published when the aggregate is persisted.
   * 
   * @param event - The domain event to add
   */
  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  /**
   * Clears all domain events.
   * Should be called after events have been published.
   */
  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  /**
   * Increments the version number.
   * Should be called when the aggregate is persisted.
   */
  incrementVersion(): void {
    this._version++;
  }
}
