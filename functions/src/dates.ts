/*!
 * sri sri guru gaurangau jayatah
 */

import { DateTime } from 'luxon';

type Precision = 'day' | 'month' | 'year';

/**
 * Structure that represents “reduced precision calendar date”
 * as defined in ISO 8601-1:2019 “5.2.2.2 Representations with reduced precision”
 * and ISO 8601:2004 “4.1.2.3 Representations with reduced accuracy”
 *
 * Luxon does not support reduced precision dates out of the box:
 * // https://github.com/moment/luxon/issues/179
 */
export interface IReducedPrecisionDate {
  /**
   * Base date. Only those units are significant which are covered by the `precision` member.
   * As stated in https://moment.github.io/luxon/docs/manual/parsing.html#iso-8601,
   * “Missing lower-order values are always set to the minimum possible value.”
   * For example, “2016-05” is represented as the first day of the month in `date` member.
   */
  date: DateTime;
  /**
   * Identifies which units are defined and which are omitted.
   * For example, for “2016-05” the value will be `month`.
   */
  precision: Precision;
}

/**
 * Parses reduced precision date in ISO 8601 format.
 * @param source ISO 8601 date as string
 */
export function parseISODate(source: string): IReducedPrecisionDate | null {
  const match = /^(\d{4})(\d{2})(\d{2})$/.exec(source);
  if (match === null) return null;

  const [, year, month, day] = match;

  // Day cannot be specified if month is not specified
  if (month === '00' && day !== '00') return null;

  const iso = [year, month, day].filter((u) => u !== '00').join('-');
  const date = DateTime.fromISO(iso, { zone: 'utc' });

  // Checking if the values provided constitute a correct date.
  if (!date.isValid) return null;

  return {
    date,
    precision: month === '00' ? 'year' : day === '00' ? 'month' : 'day',
  };
}
