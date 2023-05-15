/*!
 * sri sri guru gaurangau jayatah
 */

/**
 * This should be
 * const { EleventyRenderPlugin } = require('@11ty/eleventy');
 * But it prduces TS2305 with TypeScript checking on. Perhaps an 11ty’s export issue.
 * Therefore we're using a workaround described in https://github.com/11ty/eleventy/issues/2935
 * Otherwise we'd have to apply `@ts-ignore`.
 */
const EleventyRenderPlugin = require('@11ty/eleventy/src/Plugins/RenderPlugin.js');

require('dotenv').config({
  path: `${__dirname}/.env.local`,
});

/**
 * Eleventy config function.
 *
 * Typing idea borrowed from https://github.com/11ty/eleventy/discussions/2089
 * But it doesn't seem to work with tsconfig present.
 * Setting `maxNodeModuleJsDepth` to 1 helps, but it brings all the type check errors from 11ty.
 * Therefore as of now the below types evaluate to `any`. Still keeping the annotations for the future.
 * @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig
 * @returns {ReturnType<import("@11ty/eleventy/src/defaultConfig")>}
 */
module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget('tailwind.config.js');
  eleventyConfig.addPlugin(require('@11ty/eleventy-plugin-vite'));
  eleventyConfig.addPlugin(require('@11ty/eleventy-navigation'));
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  eleventyConfig.addPassthroughCopy('src/*.css');
  eleventyConfig.addPassthroughCopy('src/*.js');
  eleventyConfig.addPassthroughCopy('src/*.mjs');
  eleventyConfig.addPassthroughCopy('src/fonts');
  eleventyConfig.addPassthroughCopy('src/images');

  eleventyConfig.addGlobalData('env', process.env);

  //Filter for duration calculation
  eleventyConfig.addFilter('duration', async function (durationInSeconds) {
    const { formatDurationForHumans } = await import('./src/duration.mjs');
    return `${formatDurationForHumans(durationInSeconds)}`;
  });

  //Filter for Gurudev percentage calculation
  eleventyConfig.addFilter(
    'percentage',
    (audioPercentage) => `${Math.ceil(audioPercentage * 20) * 5}%`
  );

  //Filter for Sound Quality Rating color
  eleventyConfig.addFilter(
    'sound_quality_color',
    async function (soundqualitycolor) {
      const { soundQualityRatingMapping } = await import(
        './src/sound-quality-rating.mjs'
      );

      return `${soundQualityRatingMapping[soundqualitycolor].color}`;
    }
  );

  //Filter for Sound Quality Rating label
  eleventyConfig.addFilter(
    'sound_quality_label',
    async function (soundqualitylabel) {
      const { soundQualityRatingMapping } = await import(
        './src/sound-quality-rating.mjs'
      );

      return `${soundQualityRatingMapping[soundqualitylabel].label}`;
    }
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
