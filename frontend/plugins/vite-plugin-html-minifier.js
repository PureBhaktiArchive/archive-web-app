/*!
 * sri sri guru gaurangau jayatah
 */

const { minify } = require('html-minifier-terser');

/**
 * Custom HTML minification plugin, as Vite [does not support HTML minification out of the box](https://github.com/vitejs/vite/issues/3536#issuecomment-1367466561).
 * Implementation example is taken from [`vite-plugin-minify`](https://github.com/zhuweiyou/vite-plugin-minify/blob/579d7215c6741e444e1aa176ff34f6573ee07c19/src/index.ts).
 *
 * We cannot use Eleventy's transform because Vite's transforms happen after Eleventy's.
 * @returns {import('vite').Plugin}
 */
module.exports = () => ({
  name: 'html-minify',
  enforce: 'post',
  apply: 'build',
  transformIndexHtml(html) {
    return minify(html, {
      collapseWhitespace: true,
      conservativeCollapse: true,
      minifyJS: true,
      removeComments: true,
    });
  },
});
