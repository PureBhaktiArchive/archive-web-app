/*!
 * sri sri guru gaurangau jayatah
 */

const { EleventyRenderPlugin } = require('@11ty/eleventy');
const { formatDurationForHumans } = require('./config/filters/duration');
const {
  soundQualityRatingMapping,
} = require('./config/filters/sound-quality-rating');
const { getDirectusClient } = require('./config/directus');

require('dotenv').config({
  path: `${__dirname}/.env.local`,
});

/**
 * Eleventy config function.
 *
 * Typing idea borrowed from https://github.com/11ty/eleventy/discussions/2089
 * But it doesn't seem to work with tsconfig present.
 * Setting `maxNodeModuleJsDepth` to 1 helps, but it brings all the type check errors from 11ty.
 * Therefore as of now this file is not included in the tsconfig. Intellisense is more important.
 * @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig
 * @returns {ReturnType<import("@11ty/eleventy/src/defaultConfig")>}
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
    'duration',
    (durationInSeconds) => `${formatDurationForHumans(durationInSeconds)}`
  );

  //Filter for Gurudev percentage calculation
  eleventyConfig.addFilter(
    'percentage',
    (audioPercentage) => `${Math.ceil(audioPercentage * 20) * 5}%`
  );

  //Filter for Sound Quality Rating color
  eleventyConfig.addFilter(
    'sound_quality_color',
    (soundqualitycolor) =>
      `${soundQualityRatingMapping[soundqualitycolor].color}`
  );

  //Filter for Sound Quality Rating label
  eleventyConfig.addFilter(
    'sound_quality_label',
    (soundqualitylabel) =>
      `${soundQualityRatingMapping[soundqualitylabel].label}`
  );

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
