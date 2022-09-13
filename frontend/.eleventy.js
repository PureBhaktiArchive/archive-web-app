/**
 * Eleventy config function.
 *
 * Typing idea borrowed from https://github.com/11ty/eleventy/discussions/2089
 *  @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig
 *  @returns {ReturnType<import("@11ty/eleventy/src/defaultConfig")>}
 */

const pluginNavigation = require('@11ty/eleventy-navigation');

module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget('tailwind.config.js');

  //eleventyConfig.ignores.add('src/*.html');

  eleventyConfig.addPlugin(pluginNavigation);

  // Return your Object options:
  return {
    dir: {
      input: 'src',
      layouts: '_layouts',
    },
  };
};
