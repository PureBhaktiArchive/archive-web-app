/*!
 * sri sri guru gaurangau jayatah
 */

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
      },
      cursor: {
        grab: 'grab',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
