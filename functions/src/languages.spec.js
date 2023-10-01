/*!
 * sri sri guru gaurangau jayatah
 */

import { abbreviateLanguages, categorizeLanguages } from './languages.js';

describe('Languages', () => {
  it.each`
    languages                          | category
    ${['English']}                     | ${'E'}
    ${['Hindi']}                       | ${'H'}
    ${['Bengali']}                     | ${'B'}
    ${['Hindi', 'English']}            | ${'EH'}
    ${['English', 'Hindi']}            | ${'EH'}
    ${['Hindi', 'Bengali']}            | ${'HB'}
    ${['Bengali', 'Hindi']}            | ${'HB'}
    ${['English', 'Bengali']}          | ${'EB'}
    ${['Bengali', 'English']}          | ${'EB'}
    ${['English', 'Russian']}          | ${'O'}
    ${['None', 'English']}             | ${'E'}
    ${['Other', 'English']}            | ${'O'}
    ${['Bengali', 'Hindi', 'English']} | ${'EHB'}
    ${['English', 'Hindi', 'Spanish']} | ${'O'}
    ${[]}                              | ${null}
  `(
    '$languages should be categorized to "$category" category',
    ({ languages, category }) => {
      expect(categorizeLanguages(languages)).toBe(category);
    }
  );

  it.each`
    languages                          | abbreviation
    ${['English']}                     | ${'ENG'}
    ${['Hindi']}                       | ${'HIN'}
    ${['Bengali']}                     | ${'BEN'}
    ${['Hindi', 'English']}            | ${'HIN,ENG'}
    ${['English', 'Hindi']}            | ${'HIN,ENG'}
    ${['Hindi', 'Bengali']}            | ${'HIN,BEN'}
    ${['Bengali', 'Hindi']}            | ${'HIN,BEN'}
    ${['English', 'Bengali']}          | ${'ENG,BEN'}
    ${['Bengali', 'English']}          | ${'ENG,BEN'}
    ${['English', 'Russian']}          | ${'ENG,RUS'}
    ${['Spanish', 'English']}          | ${'ENG,SPA'}
    ${['SPANISH', 'English']}          | ${'ENG,SPA'}
    ${['Bengali', 'Hindi', 'English']} | ${'HIN,ENG,BEN'}
    ${['English', 'Hindi', 'Spanish']} | ${'HIN,ENG,SPA'}
    ${[]}                              | ${null}
  `(
    '$languages should be abbreviated as "$abbreviation"',
    ({ languages, abbreviation }) => {
      expect(abbreviateLanguages(languages)).toBe(abbreviation);
    }
  );
});
