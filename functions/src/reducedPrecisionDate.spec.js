/*!
 * sri sri guru gaurangau jayatah
 */

import { DateTime } from 'luxon';
import {
  formatReducedPrecisionDateForHumans,
  parseReducedPrecisionIsoDate,
} from './reducedPrecisionDate.js';

describe('ISO date', () => {
  it.each`
    input           | date            | precision
    ${'19960422'}   | ${'1996-04-22'} | ${'day'}
    ${'1996-04-22'} | ${'1996-04-22'} | ${'day'}
    ${'199611'}     | ${'1996-11-01'} | ${'month'}
    ${'1996-11'}    | ${'1996-11-01'} | ${'month'}
    ${'1991'}       | ${'1991-01-01'} | ${'year'}
    ${'1991'}       | ${'1991-01-01'} | ${'year'}
  `(
    '"$input" should be parsed as $date with $precision precision',
    ({ input, date, precision }) => {
      const result = parseReducedPrecisionIsoDate(input);
      expect(result).not.toBeNull();
      expect(result?.date.valueOf()).toEqual(
        DateTime.fromISO(date + 'T00:00:00.000Z').valueOf()
      );
      expect(result?.precision).toStrictEqual(precision);
    }
  );

  it.each([
    'some', // Arbitrary string
    '12345', // Not enough digits
    '2016-W21-3', // Week notation is not accepted
    '2016-200', // Ordinal dates are not accepted
    '2016200', // Ordinal dates are not accepted
    '2016-05-25T09', // Time is not accepted
    '2016-05-25T09:24', // Time is not accepted
    '2016-05-25T09:24:15', // Time is not accepted
    '2016-05-25T09:24:15.123', // Time is not accepted
    '2016-05-25T0924', // Time is not accepted
    '2016-05-25T092415', // Time is not accepted
    '2016-05-25T092415.123', // Time is not accepted
    '2016-05-25T09:24:15,123', // Time is not accepted
    '19991301', // Non-existing month
    '19991131', // Non-existing day of November
    '19990229', // Not a leap year
    '19910023', // Month not specified but day is
    '2005-05-00', // Day is zero, should be absent
    '2005-00-00', // Day and month are zeros, should be absent
    '2006-7', // One-digit month
    '2006-07-4', // One-digit day
  ])('"%s" should produce null on parsing', (input) => {
    expect(parseReducedPrecisionIsoDate(input)).toBeNull();
  });

  it.each`
    isoDate         | precision  | formatted
    ${'1996-04-02'} | ${'day'}   | ${'April 2, 1996'}
    ${'1996-04-22'} | ${'day'}   | ${'April 22, 1996'}
    ${'1996-04-22'} | ${'month'} | ${'April 1996'}
    ${'1996-04-22'} | ${'year'}  | ${'1996'}
  `(
    '"$isoDate" with $precision precision should be formatted as “$formatted”',
    ({ isoDate, precision, formatted }) => {
      /** @type {import('./reducedPrecisionDate.js').ReducedPrecisionDate} */
      const date = {
        date: DateTime.fromISO(isoDate, { zone: 'utc', locale: 'en-US' }),
        precision: precision,
      };
      expect(formatReducedPrecisionDateForHumans(date)).toEqual(formatted);
    }
  );
});
