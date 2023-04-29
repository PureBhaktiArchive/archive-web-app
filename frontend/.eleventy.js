/*!
 * sri sri guru gaurangau jayatah
 */

const { EleventyRenderPlugin } = require('@11ty/eleventy');
const { formatDurationForHumans } = require('./src/duration');
const { soundQualityRatingMapping } = require('./src/sound-quality-rating');

require('dotenv').config({
  path: `${__dirname}/.env.local`,
});

/**
 * Eleventy config function.
 *
 * Typing idea borrowed from https://github.com/11ty/eleventy/discussions/2089
 *  @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig
 *  @returns {ReturnType<import("@11ty/eleventy/src/defaultConfig")>}
 */
module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget('tailwind.config.js');
  eleventyConfig.addPlugin(require('@11ty/eleventy-navigation'));
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addGlobalData('env', process.env);

  //Filter for duration calculation
  eleventyConfig.addFilter('duration', function (durationInSeconds) {
    return `${formatDurationForHumans(durationInSeconds)}`;
  });

  //Filter for Gurudev percentage calculation
  eleventyConfig.addFilter(
    'percentage',
    (audioPercentage) => `${Math.ceil(audioPercentage * 20) * 5}%`
  );

  //Filter for Sound Quality Rating color
  eleventyConfig.addFilter('sound_quality_color', function (soundqualitycolor) {
    return `${soundQualityRatingMapping[soundqualitycolor].color}`;
  });

  //Filter for Sound Quality Rating label
  eleventyConfig.addFilter('sound_quality_label', function (soundqualitylabel) {
    return `${soundQualityRatingMapping[soundqualitylabel].label}`;
  });

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
