/*!
 * sri sri guru gaurangau jayatah
 */

const { formatReducedPrecisionDate } = require('./reduced-precision-date.js');

describe('ISO date', () => {
  it.each`
    input           | formatted
    ${'1996-04-02'} | ${'2 April 1996'}
    ${'1996-04-22'} | ${'22 April 1996'}
    ${'1996-11'}    | ${'November 1996'}
    ${'1991'}       | ${'1991'}
  `('"$input" should be formatted as $formatted', ({ input, formatted }) => {
    expect(formatReducedPrecisionDate(input)).toStrictEqual(formatted);
  });

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
    '19960422', // Without a delimiter
    '19991301', // Non-existing month
    '19991131', // Non-existing day of November
    '19990229', // Not a leap year
    '19910023', // Month not specified but day is
    '2005-05-00', // Day is zero, should be absent
    '2005-00-00', // Day and month are zeros, should be absent
    '2006-7', // One-digit month
    '2006-07-4', // One-digit day
  ])('"%s" should produce null on formatting', (input) => {
    expect(formatReducedPrecisionDate(input)).toBeNull();
  });
});
