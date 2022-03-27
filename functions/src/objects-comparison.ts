/*!
 * sri sri guru gaurangau jayatah
 */

/**
 * Compares properties of two objects. Comparison is shallow, i.e. only direct properties are compared.
 * @param a First object
 * @param b Second object
 * @param restrictive Whether object `b` should not have any additional properties besides those found in object `a`
 * @returns Whether two objects are equal
 */
export const shallowlyEqual = (
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  restrictive = true
): boolean =>
  (!restrictive || Object.keys(a).length === Object.keys(b).length) &&
  Object.keys(a).every(
    (key) => Object.prototype.hasOwnProperty.call(b, key) && a[key] === b[key]
  );
