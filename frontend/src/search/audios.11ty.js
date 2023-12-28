/*!
 * sri sri guru gaurangau jayatah
 */

const { categorizeLanguages } = require('../languages');
const { formatReducedPrecisionDate } = require('../reduced-precision-date');

/**
 * This JS template saves the audios data for the search index.
 * The output file is used in the deployment process only, see `deployment.yaml`.
 * Using the class option to specify the permalink: https://www.11ty.dev/docs/languages/javascript/#permalinks.
 *
 * Placing the file into the `public` directory in order to make sure Vite copies it verbatim (https://vitejs.dev/guide/assets#the-public-directory).
 * The inner directory name starts with a dot to be ignored by the Firebase deployment (https://firebase.google.com/docs/hosting/full-config#ignore).
 */
class Renderer {
  data() {
    return {
      permalink: 'public/.search/audios.json',
    };
  }

  /**
   * Transforms the audios data from the CMS
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
