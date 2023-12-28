/*!
 * sri sri guru gaurangau jayatah
 */

import { DateTime } from 'luxon';

/**
 * For `2005-01-08` the precision is `day`. For `2016-05` the precision is
 * `month`, For `2005` the precision is `year`.
 *
 * @typedef {'day' | 'month' | 'year'} Precision
 */

/**
 * Structure that represents “reduced precision calendar date” as defined in ISO
 * 8601-1:2019 “5.2.2.2 Representations with reduced precision” and ISO
 * 8601:2004 “4.1.2.3 Representations with reduced accuracy”
 *
 * Luxon does not support reduced precision dates out of the box:
 * https://github.com/moment/luxon/issues/179
 *
 * @typedef {Object} ReducedPrecisionDate
 * @property {DateTime} date Base date. Only those units are significant which
 *   are covered by the `precision` member. As stated in
 *   https://moment.github.io/luxon/docs/manual/parsing.html#iso-8601, “Missing
 *   lower-order values are always set to the minimum possible value.” For
 *   example, `2016-05` is represented as `2016-05-01` in the base date.
 * @property {Precision} precision Identifies which units are defined and which
 *   are omitted. For example, for `2016-05` the value will be `month`.
 */

/**
 * Parses reduced precision date in ISO 8601 format `YYYY-MM-DD` where
 * lower-order values may be missing: `YYYY-MM` or `YYYY`.
 *
 * @param {string} source Date as string.
 * @returns {ReducedPrecisionDate | null}
 */
export function parseReducedPrecisionIsoDate(source) {
  const match = /^\d{4}(?:(-?)(\d{2})(?:\1(\d{2}))?)?$/.exec(source);
  if (match === null) return null;

  const [, , month, day] = match;

  const date = DateTime.fromISO(source, { zone: 'utc', locale: 'en-US' });

  // Checking if the values provided constitute a correct date.
  if (!date.isValid) return null;

  return {
    date,
    precision: day ? 'day' : month ? 'month' : 'year',
  };
}

/**
 * Returns reduced precision date in a human-readable form according to
 * precision.
 *
 * - Full date: April 22, 1996.
 * - Month: April 1996.
 * - Year: 1996.
 *
 * @param {ReducedPrecisionDate} date Date with reduced precision.
 * @returns {string} Formatted string.
 */
export const formatReducedPrecisionDateForHumans = (date) =>
  date.date.toLocaleString(
    date.precision === 'day'
      ? DateTime.DATE_FULL
      : date.precision === 'month'
        ? {
            year: 'numeric',
            month: 'long',
          }
        : { year: 'numeric' }
  );
