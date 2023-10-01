/*!
 * sri sri guru gaurangau jayatah
 */

/**
 * @param {string} [text]
 * @returns {string[]}
 */
export const parseCSV = (text, separator = ',') =>
  (text?.trim() || null)?.split(separator)?.map((value) => value.trim()) || [];
