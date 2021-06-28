/*!
 * sri sri guru gaurangau jayatah
 */

export const shallowlyEqual = (
  a: Record<string, unknown>,
  b: Record<string, unknown>
): boolean =>
  Object.keys(a).length === Object.keys(b).length &&
  Object.keys(a).every(
    (key) => Object.prototype.hasOwnProperty.call(b, key) && a[key] === b[key]
  );
