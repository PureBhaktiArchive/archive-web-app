/*!
 * sri sri guru gaurangau jayatah
 */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    screens: {
      'mobile-s': '320px',
      'mobile-m': '375px',
      'mobile-l': '425px',
      ...defaultTheme.screens,
    },
    extend: {
      boxShadow: {
        'xl-around': '0px 0px 25px 0px rgba(0,0,0,0.3)',
      },
      fontFamily: {
        erasDemi: ['ITC Eras Demi'],
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
