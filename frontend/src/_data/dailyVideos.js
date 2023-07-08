/*!
 * sri sri guru gaurangau jayatah
 */

/**
 * @typedef {'published' | 'scheduled'} Status
 *
 * @typedef Video
 * @property {string} date_published
 * @property {Status} status
 * @property {string} video_url
 * @property {string} title
 * @property {'en' | 'hi'} language
 *
 * @typedef TypeMap
 * @property {Video} daily_videos
 *
 * @typedef {import('@directus/sdk').Directus<TypeMap>} Directus
 */

/**
 *
 * @param {{directus: Directus}} data
 * @returns {Promise<{language: string, videoID: string}[]>}
 */
module.exports = async ({ directus }) =>
  (
    await Promise.all(
      ['en', 'hi'].map(async (language) => {
        const videoUrl = await queryDailyVideoUrl(directus, language);
        return videoUrl
          ? {
              language,
              videoID: youTubeUrlRegexp.exec(videoUrl).groups['videoId'],
            }
          : null;
      })
    )
  ).filter(Boolean);

/**
 * Extracts Video ID from a YouTube URL
 * Groups:
 *   - videoId
 * https://regex101.com/r/wISpTS/1
 */
const youTubeUrlRegexp =
  /^(?:https?:)?(?:\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])(?<videoId>[\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*$/i;

/**
 *
 * @param {Directus} directus
 * @param {string} language
 * @returns {Promise<string>}
 */
const queryDailyVideoUrl = async (directus, language) =>
  (
    await directus.items('daily_videos').readByQuery({
      fields: ['video_url'],
      filter: {
        status: { _eq: 'published' },
        date_published: { _lte: '$NOW' },
        language: { _eq: language },
      },
      sort: ['-date_published'],
      limit: 1,
    })
  ).data?.[0]?.video_url;
