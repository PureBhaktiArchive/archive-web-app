/*!
 * sri sri guru gaurangau jayatah
 */

const { categorizeLanguages } = require('../languages');
const { formatReducedPrecisionDate } = require('../reduced-precision-date');

// https://www.11ty.dev/docs/languages/javascript/#classes
class Renderer {
  data() {
    return {
      //  Saving this data for the deployment process only.
      //  File name starts with a dot to be ignored by the Firebase deployment (https://firebase.google.com/docs/hosting/full-config#ignore).
      permalink: '.search/audios.json',
    };
  }

  /**
   * Adds some attributes for the search index
   * @param {EleventyGlobalData} data
   */
  render({ audios }) {
    return JSON.stringify(
      audios.map(
        /**
         * Explicitly listing all the required members instead of a spread operator
         * to avoid extraneous properties to get into the search index
         * @return {AudioForSearch}
         **/
        ({
          id,
          title,
          topics,
          date,
          dateUncertain,
          timeOfDay,
          location,
          locationUncertain,
          category,
          percentage,
          soundQualityRating,
          languages,
          otherSpeakers,
          duration,
        }) => ({
          objectID: id.toString(),
          fileId: id,
          title,
          topics,
          date,
          dateUncertain,
          timeOfDay,
          location,
          locationUncertain,
          category,
          percentage,
          soundQualityRating,
          languages,
          otherSpeakers,
          duration,
          year: +date?.substring(0, 4),
          dateForHumans: formatReducedPrecisionDate(date),
          languageCategory: categorizeLanguages(languages),
        })
      )
    );
  }
}

module.exports = Renderer;
