/*!
 * sri sri guru gaurangau jayatah
 */

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        peach: {
          light: '#fed0b1',
          DEFAULT: '#ffb07c',
          dark: '#ff8b3f',
        },
      },
      cursor: {
        grab: 'grab',
      },
      spacing: {
        half: '50%',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
