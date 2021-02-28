/*!
 * sri sri guru gaurangau jayatah
 */

const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: {
    content: ['./src/**/*.html', './src/**/*.js'],
    options: {
      safelist: {
        greedy: [/^ais-/],
      },
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'mobile-s': '320px',
      'mobile-m': '375px',
      'mobile-l': '425px',
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        peach: {
          light: '#fed0b1',
          DEFAULT: '#ffb07c',
          dark: '#ff8b3f',
        },
        maroon: {
          50: '#f9f2f2',
          100: '#f3e6e6',
          200: '#e0bfbf',
          300: '#cd9999',
          400: '#a84d4d',
          500: '#820000',
          600: '#750000',
          700: '#620000',
          800: '#4e0000',
          900: '#400000',
        },
        submarine: {
          50: '#fbfcfc',
          100: '#f8fafa',
          200: '#edf1f2',
          300: '#e1e9eb',
          400: '#cbd9db',
          500: '#b5c8cc',
          600: '#a3b4b8',
          700: '#889699',
          800: '#6d787a',
          900: '#596264',
        },
        'burnt-sienna': {
          50: '#fef8f6',
          100: '#fdf0ed',
          200: '#fbdbd2',
          300: '#f9c5b7',
          400: '#f49981',
          500: '#ef6d4b',
          600: '#d76244',
          700: '#b35238',
          800: '#8f412d',
          900: '#753525',
        },
        teal: colors.teal,
      },
      cursor: {
        grab: 'grab',
      },
      fontFamily: {
        header: ['capitals', ...defaultTheme.fontFamily.serif],
      },
      scale: {
        '-1': '-1',
      },
    },
  },
  variantOrder: [
    'children',
    'DEFAULT',
    'first',
    'last',
    'odd',
    'even',
    'visited',
    'checked',
    'group-hover',
    'group-focus',
    'focus-within',
    'children-first',
    'children-last',
    'children-odd',
    'children-even',
    'children-not-first',
    'children-not-last',
    'children-hover',
    'hover',
    'children-focus',
    'focus',
    'children-focus-within',
    'focus-visible',
    'children-active',
    'active',
    'children-visited',
    'children-disabled',
    'disabled',
  ],
  variants: {
    extend: {
      padding: ['children'],
      margin: ['children'],
      borderColor: ['children'],
      borderWidth: ['children', 'children-last'],
      borderRadius: ['children'],
      backgroundColor: ['children'],
    },
  },
  plugins: [require('tailwindcss-children')],
};
