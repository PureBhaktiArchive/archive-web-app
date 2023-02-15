/*!
 * sri sri guru gaurangau jayatah
 */

const { EleventyRenderPlugin } = require('@11ty/eleventy');

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
    const formatDuration = new Date(1000 * durationInSeconds)
      .toISOString()
      .substring(Math.max(durationInSeconds || 0) >= 3600 ? 11 : 14, 19);
    return formatDuration;
  });

  //Filter for Gurudev percentage calculation
  eleventyConfig.addFilter('percentage', function (audioPercentage) {
    const formatPercentage = `${Math.ceil(audioPercentage * 20) * 5}%`;
    return formatPercentage;
  });

  //Filter for Sound Quality Rating color
  eleventyConfig.addFilter('soundquality', function (soundquality) {
    const SoundQualityRating = {
      Good: { label: 'Good', order: 1, color: 'bg-emerald-100' },
      Average: { label: 'Average', order: 2, color: 'bg-yellow-100' },
      Low: { label: 'Barely Audible', order: 3, color: 'bg-red-100' },
    };
    return `${SoundQualityRating[soundquality].color}`;
  });

  //Filter for language arry
  eleventyConfig.addFilter('toarray', function (languages) {
    let addpipe = languages.join(' | ');
    return addpipe;
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
