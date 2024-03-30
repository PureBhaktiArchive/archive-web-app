/*!
 * sri sri guru gaurangau jayatah
 */

const { google } = require('googleapis');

/**
 * Extracts Video ID from a YouTube URL
 * Groups:
 *   - videoId
 * https://regex101.com/r/wISpTS/2
 */
const youTubeUrlRegexp =
  /^(https?:\/\/)?(youtu\.be\/|((www|m)\.)?youtube(?:-nocookie)?\.com\/(\w*\?(.*&)?v=|(shorts|embed|v|e)\/))(?<videoId>[\w\-_]{11})([&?].*)?$/i;

/**
 * Returns details of the video using YouTube API
 * @param {string} videoId
 */
const getVideoDetails = async function (videoId) {
  const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
  });
  const response = await youtube.videos.list({
    id: [videoId],
    part: ['snippet'],
  });
  return response.data.items?.[0];
};

/**
 * Retrieves all available thumbnails for the video
 * @param {import('googleapis').youtube_v3.Schema$VideoSnippet} videoSnippet
 * @returns Array of available thumbnails for the video
 */
const getThumbnails = (videoSnippet) =>
  Object.values(
    /** @type {Record<string, import('googleapis').youtube_v3.Schema$Thumbnail>} */ (
      videoSnippet.thumbnails
    )
  );

/**
 * Constructs `srcset` attribute for the thumbnail image element
 * @param {import('googleapis').youtube_v3.Schema$Thumbnail[]} thumbnails
 * @returns {string} value for image's `srcset` attribute
 */
const getSrcSet = (thumbnails) =>
  thumbnails
    .map(
      (thumbnail) =>
        `${thumbnail.url} ${
          // If it's vertical, only middle portion will be taken from the thumbnail
          Math.trunc(thumbnail.width)
        }w`
    )
    .join(', ');

module.exports = {
  youTubeUrlRegexp,
  getVideoDetails,
  getThumbnails,
  getSrcSet,
};
