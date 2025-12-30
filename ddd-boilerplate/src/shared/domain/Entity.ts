/**
 * Base class for all Entities in the domain.
 * 
 * Entities are objects with a distinct identity that runs through time
 * and different states. Two entities are equal if they have the same identity,
 * regardless of their attributes.
 * 
 * @template T - The type of the entity's identifier (should extend Identifier)
 */
export abstract class Entity<T> {
  protected readonly _id: T;

  protected constructor(id: T) {
    this._id = id;
  }

  /**
   * Returns the entity's unique identifier
   */
  get id(): T {
    return this._id;
  }

  /**
   * Checks if this entity is equal to another entity.
   * Two entities are equal if they have the same identity.
   * 
   * @param other - The entity to compare with
   * @returns true if the entities have the same identity
   */
  equals(other: Entity<T> | null | undefined): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (!(other instanceof Entity)) {
      return false;
    }

    if (this === other) {
      return true;
    }

    return this.idEquals(other._id);
  }

  /**
   * Compares two identifiers for equality.
   * Override this method if your identifier type has a custom equality check.
   * 
   * @param otherId - The other identifier to compare
   * @returns true if the identifiers are equal
   */
  protected idEquals(otherId: T): boolean {
    // If the id has an equals method (like a ValueObject), use it
    if (this._id && typeof (this._id as unknown as { equals: (other: T) => boolean }).equals === 'function') {
      return (this._id as unknown as { equals: (other: T) => boolean }).equals(otherId);
    }
    
    // Otherwise, use strict equality
    return this._id === otherId;
  }
}
