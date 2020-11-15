/*!
 * sri sri guru gaurangau jayatah
 */

module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 2018,
  },
  plugins: ['@typescript-eslint', 'import', 'header'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'prettier',
    'prettier/@typescript-eslint',
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
