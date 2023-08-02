/*!
 * sri sri guru gaurangau jayatah
 */

/**
 * @typedef Video
 * @property {string} url
 * @property {'en' | 'hi'} language
 * @property {boolean} vertical
 *
 * @typedef Home
 * @property {Video} english_video
 * @property {Video} hindi_video
 * @property {Video} short_video
 *
 * @typedef TypeMap
 * @property {Home} home
 *
 * @typedef {import('@directus/sdk').Directus<TypeMap>} Directus
 */

/**
 *
 * @param {{directus: Directus}} data
 * @returns {Promise<{title: string, vertical: boolean, videoID: string}[]>}
 */
const fetchVideos = async ({ directus }) =>
  Object.entries(
    // Type conversion required because SDK returns a singleton, but typing says it's an array
    // Conversion to `unknown` first is required because types are incompatible
    /**@type {Home} */ /** @type {unknown} */ (
      (
        await directus.items('home').readByQuery({
          fields: ['*.url', '*.language', '*.vertical'],
        })
      ).data
    )
  )
    // Filtering out other possible properties
    .filter(([property]) => property.endsWith('_video'))
    .map(([, { url, language, vertical }]) => ({
      title: vertical
        ? 'Short video of the day'
        : `Today’s harikatha (${new Intl.DisplayNames('en', {
            type: 'language',
          }).of(language)})`,
      vertical,
      videoID: youTubeUrlRegexp.exec(url).groups['videoId'],
    }));

/**
 * Extracts Video ID from a YouTube URL
 * Groups:
 *   - videoId
 * https://regex101.com/r/wISpTS/2
 */
const youTubeUrlRegexp =
  /^(https?:\/\/)?(youtu\.be\/|((www|m)\.)?youtube(?:-nocookie)?\.com\/(\w*\?(.*&)?v=|(shorts|embed|v|e)\/))(?<videoId>[\w\-_]{11})([&?].*)?$/i;

module.exports = async (data) => ({
  videos: await fetchVideos(data),
});
