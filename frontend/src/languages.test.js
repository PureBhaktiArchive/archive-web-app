/*!
 * sri sri guru gaurangau jayatah
 */

const { categorizeLanguages } = require('./languages');

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
});
