/*!
 * sri sri guru gaurangau jayatah
 */

/**
 * Formats a reduced precision date in a human-readable form.
 *
 * - Full date: 22 April 1996.
 * - Month: April 1996.
 * - Year: 1996.
 *
 * Luxon does not support reduced precision dates out of the box:
 * https://github.com/moment/luxon/issues/179
 *
 * @param {string} input A “reduced precision calendar date” as defined in
 *     ISO 8601-1:2019 “5.2.2.2 Representations with reduced precision” and
 *     ISO 8601:2004 “4.1.2.3 Representations with reduced accuracy”
 * @returns {string} A formatted string or `null` if the input string is not a valid ISO date
 */
const formatReducedPrecisionDate = (input) => {
  const match = /^\d{4}(-(?<month>\d{2})(-(?<day>\d{2}))?)?$/.exec(input);
  if (match === null) return null;

  const date = new Date(input);
  if (Number.isNaN(date.valueOf())) return null;

  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: match.groups.month ? 'long' : undefined,
    day: match.groups.day ? 'numeric' : undefined,
  });
};

module.exports = { formatReducedPrecisionDate };
