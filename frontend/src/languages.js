/*!
 * sri sri guru gaurangau jayatah
 */

// Order is important, in this order the initial letters will be included into the category.
const mainLanguages = ['English', 'Hindi', 'Bengali'];

/**
 * Calculates a language category for a given set of languages.
 * This category is used in the search index for faceting.
 * Only the main languages are represented in the category abbreviation.
 * If any other language is present, the category is `O` (Other).
 * The `None` language is ignored.
 * @param {string[]} languages
 * @returns {string | 'O' | null}
 */
const categorizeLanguages = (languages) =>
  !languages?.length
    ? null
    : // If any other language is present (except None)
    languages.some((x) => x !== 'None' && !mainLanguages.includes(x))
    ? 'O'
    : mainLanguages
        .flatMap((x) => (languages.includes(x) ? x.at(0).toUpperCase() : []))
        .join('');

module.exports = { categorizeLanguages };
