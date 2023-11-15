/*!
 * sri sri guru gaurangau jayatah
 */

import { parseCSV } from './csv.js';

describe('CSV', () => {
  it.each`
    input                      | values
    ${'English'}               | ${['English']}
    ${'Hindi'}                 | ${['Hindi']}
    ${'Bengali'}               | ${['Bengali']}
    ${'Hindi,English'}         | ${['Hindi', 'English']}
    ${'English, Hindi'}        | ${['English', 'Hindi']}
    ${'Hindi,Bengali'}         | ${['Hindi', 'Bengali']}
    ${'English,Bengali'}       | ${['English', 'Bengali']}
    ${'Bengali,Hindi,English'} | ${['Bengali', 'Hindi', 'English']}
    ${'English,Russian'}       | ${['English', 'Russian']}
    ${'English,Hindi,Spanish'} | ${['English', 'Hindi', 'Spanish']}
    ${'  '}                    | ${[]}
    ${''}                      | ${[]}
    ${undefined}               | ${[]}
    ${null}                    | ${[]}
  `('"$input" should be parsed to "$values"', ({ input, values }) => {
    expect(parseCSV(input)).toStrictEqual(values);
  });

  it.each`
    input                                                                        | values
    ${'Srila BV Vamana Gosvami Maharaja & Srila BV Trivikrama Gosvami Maharaja'} | ${['Srila BV Vamana Gosvami Maharaja', 'Srila BV Trivikrama Gosvami Maharaja']}
    ${'Srila Bhakti Pramod Puri Gosvami Maharaja'}                               | ${['Srila Bhakti Pramod Puri Gosvami Maharaja']}
  `('"$input" should be parsed to "$values"', ({ input, values }) => {
    expect(parseCSV(input, '&')).toStrictEqual(values);
  });
});
