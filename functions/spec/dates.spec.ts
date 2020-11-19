/*!
 * sri sri guru gaurangau jayatah
 */

import { DateTime } from 'luxon';
import { parsePseudoISODate } from '../src/dates';

describe('Pseudo ISO date', () => {
  it.each`
    input         | iso             | date            | precision
    ${'19960422'} | ${'1996-04-22'} | ${'1996-04-22'} | ${'day'}
    ${'19961100'} | ${'1996-11'}    | ${'1996-11-01'} | ${'month'}
    ${'19910000'} | ${'1991'}       | ${'1991-01-01'} | ${'year'}
  `(
    '"$input" should be parsed to $iso with $precision precision and $date base date',
    ({ input, date, precision, iso }) => {
      const result = parsePseudoISODate(input);
      expect(result).not.toBeNull();
      expect(result?.iso).toStrictEqual(iso);
      expect(result?.date.valueOf()).toEqual(
        DateTime.fromISO(date + 'T00:00:00.000Z').valueOf()
      );
      expect(result?.precision).toStrictEqual(precision);
    }
  );

  it.each([
    'some', // Arbitrary string
    '123412', // Not enough digits
    '19991301', // Non-existing month
    '19991131', // Non-existing day of November
    '19990229', // Not a leap year
    '189912131', // Earlier than 1900
    '19910023', // Month not specified but day is
  ])('"%s" should produce null on parsing', (input) => {
    expect(parsePseudoISODate(input)).toBeNull();
  });
});
