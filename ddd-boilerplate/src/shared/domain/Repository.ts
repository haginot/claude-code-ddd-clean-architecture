import type { AggregateRoot } from './AggregateRoot.js';

/**
 * Base interface for all Repositories.
 * 
 * Repositories provide an abstraction over data persistence, presenting
 * a collection-like interface for accessing and storing Aggregate Roots.
 * 
 * Key principles:
 * - Repositories work with Aggregate Roots only
 * - Return domain objects, never DTOs or database models
 * - Repository interfaces are defined in the domain layer
 * - Repository implementations are in the infrastructure layer
 * 
 * @template T - The Aggregate Root type
 * @template ID - The identifier type of the Aggregate Root
 */
export interface Repository<T extends AggregateRoot<ID>, ID> {
  /**
   * Persists an aggregate root.
   * Creates a new record if it doesn't exist, updates if it does.
   * 
   * @param aggregate - The aggregate root to save
   */
  save(aggregate: T): Promise<void>;

  /**
   * Finds an aggregate root by its identifier.
   * 
   * @param id - The identifier of the aggregate root
   * @returns The aggregate root if found, null otherwise
   */
  findById(id: ID): Promise<T | null>;

  /**
   * Checks if an aggregate root exists with the given identifier.
   * 
   * @param id - The identifier to check
   * @returns true if the aggregate exists
   */
  exists(id: ID): Promise<boolean>;

  /**
   * Removes an aggregate root from persistence.
   * 
   * @param aggregate - The aggregate root to delete
   */
  delete(aggregate: T): Promise<void>;
}

/**
 * Interface for Unit of Work pattern.
 * 
 * Manages transactions across multiple repository operations,
 * ensuring all-or-nothing persistence semantics.
 */
export interface UnitOfWork {
  /**
   * Executes a function within a transaction.
   * All repository operations within the function are committed together.
   * 
   * @param work - The function containing repository operations
   * @returns The result of the work function
   */
  execute<T>(work: () => Promise<T>): Promise<T>;

  /**
   * Begins a new transaction.
   */
  begin(): Promise<void>;

  /**
   * Commits all changes made since begin().
   */
  commit(): Promise<void>;

  /**
   * Rolls back all changes made since begin().
   */
  rollback(): Promise<void>;
}

/**
 * Optional interface for repositories that support pagination.
 * 
 * @template T - The Aggregate Root type
 */
export interface PaginatedResult<T> {
  /**
   * The items for the current page
   */
  items: T[];

  /**
   * Total number of items across all pages
   */
  total: number;

  /**
   * Current page number (0-indexed)
   */
  page: number;

  /**
   * Number of items per page
   */
  pageSize: number;

  /**
   * Whether there are more pages available
   */
  hasNextPage: boolean;

  /**
   * Whether there are previous pages
   */
  hasPreviousPage: boolean;
}
