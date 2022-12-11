/*!
 * sri sri guru gaurangau jayatah
 */

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['import', 'header'],
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'prettier',
  ],
  rules: {
    'header/header': [
      'error',
      'block',
      ['!', ' * sri sri guru gaurangau jayatah', ' '],
      2,
    ],
  },
};
