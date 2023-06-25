/*!
 * sri sri guru gaurangau jayatah
 */

const colors = require('tailwindcss/colors');
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
      flex: {
        2: '2 2 0%',
        3: '3 3 0%',
        4: '4 4 0%',
      },
      colors: {
        peach: {
          light: '#fed0b1',
          DEFAULT: '#ffb07c',
          dark: '#ff8b3f',
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
        gray: colors.slate,
      },
      fontFamily: {
        erasDemi: ['ITC Eras Demi'],
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@stefanracic/tailwind-child'),
  ],
};
