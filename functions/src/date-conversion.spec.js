/*!
 * sri sri guru gaurangau jayatah
 */

import { DateTime } from 'luxon';
import { fromSerialDate, toSerialDate } from './date-conversion.js';

describe.each`
  serialDate          | iso
  ${43379}            | ${'2018-10-06T00:00:00+05:30'}
  ${60.6506944444445} | ${'1900-02-28T15:37:00+05:30'}
  ${60.6506944560185} | ${'1900-02-28T15:37:00.001+05:30'}
`('Conversion between $serialDate and $iso', ({ serialDate, iso }) => {
  const datetime = DateTime.fromISO(iso, { setZone: true });

  test('from Serial to DateTime', () => {
    // Testing to assert that the zoneName is not null
    // Because we cannot augment TSSettings with JSDoc similar to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/273b347a3d66948ecf59b2d412dab9794d3d9310/types/luxon/test/luxon-tests.module.ts#L16-L20
    if (datetime.zoneName === null) throw new Error(`${iso} is invalid`);
    expect(fromSerialDate(serialDate, datetime.zoneName)).toEqual(datetime);
  });

  test('from DateTime to Serial', () => {
    expect(toSerialDate(datetime)).toBeCloseTo(serialDate, 8);
  });
});
