/**
 * Interface for Domain Events.
 * 
 * Domain Events are immutable records of something significant that
 * happened in the domain. They use past tense naming to indicate
 * that something has already occurred.
 * 
 * Examples: OrderCreated, PaymentProcessed, CustomerRegistered
 * 
 * Domain events should:
 * - Be immutable (all properties readonly)
 * - Use past tense naming
 * - Contain all data needed to describe what happened
 * - Include a timestamp of when the event occurred
 */
export interface DomainEvent {
  /**
   * The timestamp when this event occurred.
   */
  readonly occurredAt: Date;

  /**
   * The type/name of the event (e.g., 'OrderCreated').
   * Used for event routing and serialization.
   */
  readonly eventType: string;
}

/**
 * Abstract base class for Domain Events with common functionality.
 * 
 * Extend this class to create concrete domain events with additional properties.
 */
export abstract class BaseDomainEvent implements DomainEvent {
  readonly occurredAt: Date;
  abstract readonly eventType: string;

  protected constructor() {
    this.occurredAt = new Date();
  }
}

/**
 * Interface for publishing domain events.
 * 
 * Implementations may publish events synchronously, asynchronously,
 * to a message queue, or to multiple handlers.
 */
export interface EventPublisher {
  /**
   * Publishes a domain event to all registered handlers.
   * 
   * @param event - The domain event to publish
   */
  publish(event: DomainEvent): Promise<void>;

  /**
   * Publishes multiple domain events in order.
   * 
   * @param events - The domain events to publish
   */
  publishAll(events: DomainEvent[]): Promise<void>;
}

/**
 * Interface for handling domain events.
 * 
 * @template T - The type of domain event this handler processes
 */
export interface EventHandler<T extends DomainEvent> {
  /**
   * Handles a domain event.
   * 
   * @param event - The domain event to handle
   */
  handle(event: T): Promise<void>;
}
