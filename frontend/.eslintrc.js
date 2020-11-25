/*!
 * sri sri guru gaurangau jayatah
 */

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
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
