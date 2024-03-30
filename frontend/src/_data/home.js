/*!
 * sri sri guru gaurangau jayatah
 */

const { readSingleton } = require('@directus/sdk');
const {
  getVideoDetails,
  getSrcSet,
  getThumbnails,
  youTubeUrlRegexp,
} = require('../youtube');

/**
 * @param {EleventyGlobalData} data
 * @returns {Promise<{title: string, vertical: boolean, videoId: string}[]>}
 */
const fetchHomePageVideos = async ({ directus }) =>
  Promise.all(
    Object.entries(
      await directus.request(
        readSingleton('home', {
          fields: [
            { english_video: ['*'], hindi_video: ['*'], short_video: ['*'] },
          ],
        })
      )
    )
      // Filtering out other possible properties
      .filter(([property]) => property.endsWith('_video'))
      .map(async ([, { url, language, vertical }]) => {
        const videoId = youTubeUrlRegexp.exec(url).groups['videoId'];
        const videoDetails = await getVideoDetails(videoId);
        const thumbnails = getThumbnails(videoDetails.snippet);
        return {
          title: vertical
            ? 'Short video of the day'
            : `Today’s harikatha (${new Intl.DisplayNames('en', {
                type: 'language',
              }).of(language)})`,
          vertical,
          videoId,
          thumbnail: {
            srcset: getSrcSet(thumbnails),
            fallbackUrl: thumbnails.at(-1).url,
          },
        };
      })
  );

/**
 * @param {EleventyGlobalData} data
 * @returns
 */
module.exports = async (data) => ({
  videos: await fetchHomePageVideos(data),
});
