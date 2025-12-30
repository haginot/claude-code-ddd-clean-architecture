/**
 * Base class for all Value Objects in the domain.
 * 
 * Value Objects are immutable objects that are defined by their attributes
 * rather than by identity. Two value objects are equal if all their
 * properties are equal.
 * 
 * @template T - An object type containing the value object's properties
 */
export abstract class ValueObject<T extends object> {
  protected readonly props: Readonly<T>;

  protected constructor(props: T) {
    this.props = Object.freeze({ ...props });
  }

  /**
   * Checks if this value object is equal to another value object.
   * Two value objects are equal if all their properties are equal.
   * 
   * @param other - The value object to compare with
   * @returns true if all properties are equal
   */
  equals(other: ValueObject<T> | null | undefined): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (!(other instanceof ValueObject)) {
      return false;
    }

    return this.propsEqual(other.props);
  }

  /**
   * Deep comparison of properties.
   * 
   * @param otherProps - The other properties to compare
   * @returns true if all properties are equal
   */
  private propsEqual(otherProps: Readonly<T>): boolean {
    const keys = Object.keys(this.props) as (keyof T)[];
    
    for (const key of keys) {
      const thisValue = this.props[key];
      const otherValue = otherProps[key];
      
      if (!this.valuesEqual(thisValue, otherValue)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Compares two values for equality.
   * Handles nested ValueObjects and primitive types.
   */
  private valuesEqual(a: unknown, b: unknown): boolean {
    // Handle ValueObject comparison
    if (a instanceof ValueObject && b instanceof ValueObject) {
      return a.equals(b);
    }
    
    // Handle Date comparison
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }
    
    // Handle array comparison
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((item, index) => this.valuesEqual(item, b[index]));
    }
    
    // Handle object comparison (non-ValueObject)
    if (this.isPlainObject(a) && this.isPlainObject(b)) {
      const aKeys = Object.keys(a);
      const bKeys = Object.keys(b);
      if (aKeys.length !== bKeys.length) return false;
      return aKeys.every(key => this.valuesEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      ));
    }
    
    // Primitive comparison
    return a === b;
  }

  /**
   * Checks if a value is a plain object (not a class instance)
   */
  private isPlainObject(value: unknown): value is Record<string, unknown> {
    return value !== null && 
           typeof value === 'object' && 
           Object.getPrototypeOf(value) === Object.prototype;
  }

  /**
   * Creates a shallow copy of the value object with updated properties.
   * Note: This returns the new props, not a new instance. Subclasses should
   * implement their own `with*` methods that create new instances.
   * 
   * @param updates - Partial properties to update
   * @returns New props with updates applied
   */
  protected copyWith(updates: Partial<T>): T {
    return { ...this.props, ...updates };
  }
}
