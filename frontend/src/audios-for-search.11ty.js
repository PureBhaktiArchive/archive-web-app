/*!
 * sri sri guru gaurangau jayatah
 */

const { formatReducedPrecisionDate } = require('./reduced-precision-date');

// https://www.11ty.dev/docs/languages/javascript/#classes
class Renderer {
  data() {
    return {
      //  Saving this data for the deployment process only.
      //  File name starts with a dot to be ignored by the Firebase deployment (https://firebase.google.com/docs/hosting/full-config#ignore).
      permalink: '.audios-for-search.json',
    };
  }

  /**
   * Adds some attributes for the search index
   * @param {EleventyGlobalData} data
   */
  render({ audios }) {
    return JSON.stringify(
      audios.map(
        /** @return {AudioForSearch} */ (audio) => ({
          ...audio,
          year: +audio.date?.substring(0, 4),
          dateForHumans: formatReducedPrecisionDate(audio.date),
          languageCategory: '',
        })
      )
    );
  }
}

module.exports = Renderer;
