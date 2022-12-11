/*!
 * sri sri guru gaurangau jayatah
 */

/**
 * @param {Record<string, unknown>} a
 * @param {Record<string, unknown>} b
 * @returns {boolean}
 */
export const shallowlyEqual = (a, b) =>
  Object.keys(a).length === Object.keys(b).length &&
  Object.keys(a).every(
    (key) => Object.prototype.hasOwnProperty.call(b, key) && a[key] === b[key]
  );
