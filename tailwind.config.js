const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    enabled: process.env.BRIDGETOWN_ENV === 'production' ? true : false,
    content: [
      "./output/**/*.html",
      "src/**/*.html",
      "src/**/*.liquid",
    ],
  },
  darkMode: false,
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
        yellow: {
          '100': '#fdf767',
          '200': '#fdf767',
          '300': '#fdf767',
          '400': '#fdf767',
          '500': '#fdf767',
          '600': '#fdf767',
          '700': '#fdf767',
          '800': '#fdf767',
          '900': '#fdf767',
        },
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      listStyleType: {
        square: 'circle',
      },
      screens: {
        'print': {'raw': 'print'},
      }
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
