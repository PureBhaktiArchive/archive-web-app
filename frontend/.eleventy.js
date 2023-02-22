/*!
 * sri sri guru gaurangau jayatah
 */

const { EleventyRenderPlugin } = require('@11ty/eleventy');
const { formatDurationForHumans } = require('./src/duration');

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

  //Filter for duration calculation
  eleventyConfig.addFilter('duration', function (durationInSeconds) {
    return `${formatDurationForHumans(durationInSeconds)}`;
  });

  //Filter for Gurudev percentage calculation
  eleventyConfig.addFilter('percentage', function (audioPercentage) {
    const formatPercentage = `${Math.ceil(audioPercentage * 20) * 5}%`;
    return formatPercentage;
  });

  //Filter for Sound Quality Rating color
  eleventyConfig.addFilter('sound_quality_color', function (soundqualitycolor) {
    const SoundQualityRatingColor = {
      Good: { label: 'Good', order: 1, color: 'bg-emerald-100' },
      Average: { label: 'Average', order: 2, color: 'bg-yellow-100' },
      Low: { label: 'Barely Audible', order: 3, color: 'bg-red-100' },
    };
    return `${SoundQualityRatingColor[soundqualitycolor].color}`;
  });

  //Filter for Sound Quality Rating label
  eleventyConfig.addFilter('sound_quality_label', function (soundqualitylabel) {
    const SoundQualityRatinglabel = {
      Good: { label: 'Good', order: 1, color: 'bg-emerald-100' },
      Average: { label: 'Average', order: 2, color: 'bg-yellow-100' },
      Low: { label: 'Barely Audible', order: 3, color: 'bg-red-100' },
    };
    return `${SoundQualityRatinglabel[soundqualitylabel].label}`;
  });

  // Return your Object options:
  return {
    dir: {
      input: 'src',
      layouts: '_layouts',
      includes: '_includes',
    },
  };
};
