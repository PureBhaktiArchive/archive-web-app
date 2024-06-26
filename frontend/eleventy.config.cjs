/*!
 * sri sri guru gaurangau jayatah
 */

// @ts-expect-error due to https://github.com/11ty/eleventy/issues/2935, which is fixed in 3.0
const { EleventyRenderPlugin } = require('@11ty/eleventy');
const { formatDurationForHumans } = require('./config/filters/duration');
const {
  soundQualityRatingMapping,
} = require('./config/filters/sound-quality-rating');
const { getDirectusClient } = require('./config/directus');
const { formatReducedPrecisionDate } = require('./src/reduced-precision-date');
const { toPlayerItem } = require('./src/player-item');

require('dotenv').config({
  path: `${__dirname}/.env.local`,
});

/**
 * Eleventy config function.
 *
 * Typing according to https://www.11ty.dev/docs/config/#type-definitions
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 *   In order for intellisense to work, `maxNodeModuleJsDepth` should be set to `1`
 */
module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget('tailwind.config.js');
  eleventyConfig.addPlugin(require('@11ty/eleventy-plugin-vite'), {
    viteOptions: require('./vite.config.js'),
  });
  eleventyConfig.addPlugin(require('@11ty/eleventy-navigation'));
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  eleventyConfig.addPassthroughCopy('src/css');
  eleventyConfig.addPassthroughCopy('src/js');
  eleventyConfig.addPassthroughCopy('src/fonts');
  eleventyConfig.addPassthroughCopy('src/images');

  // This is a public directory for Vite - https://vitejs.dev/guide/assets.html#the-public-directory
  eleventyConfig.addPassthroughCopy('src/public');

  eleventyConfig.addGlobalData('directus', getDirectusClient);

  //Filter for duration calculation
  eleventyConfig.addFilter(
    'formatDurationForHumans',
    (durationInSeconds) => `${formatDurationForHumans(durationInSeconds)}`
  );

  //Filter for Gurudev percentage calculation
  eleventyConfig.addFilter(
    'formatFractionAsPercentage',
    (audioPercentage) => `${Math.ceil(audioPercentage * 20) * 5}%`
  );

  //Filter for Sound Quality Rating color
  eleventyConfig.addFilter(
    'sound_quality_color',
    (rating) => soundQualityRatingMapping[rating]?.color
  );

  //Filter for Sound Quality Rating label
  eleventyConfig.addFilter(
    'sound_quality_label',
    (rating) => soundQualityRatingMapping[rating]?.label || rating
  );

  eleventyConfig.addFilter(
    'format_reduced_precision',
    formatReducedPrecisionDate
  );

  //audio actions filter -Download
  eleventyConfig.addFilter(
    'toFileURL',
    (fileId) => `${process.env.STORAGE_BASE_URL}/${fileId}.mp3`
  );

  eleventyConfig.addFilter(
    'toFeedbackURL',
    (fileId) => `${process.env.FEEDBACK_FORM_AUDIOS}${fileId}`
  );

  eleventyConfig.addFilter('toPlayerItem', toPlayerItem);

  // Return your Object options:
  return {
    dir: {
      input: 'src',
      layouts: '_layouts',
      includes: '_includes',
      output: 'dist',
    },
  };
};
