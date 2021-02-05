/*!
 * sri sri guru gaurangau jayatah
 */

const colors = require('tailwindcss/colors');

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
        teal: colors.teal,
      },
      cursor: {
        grab: 'grab',
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
