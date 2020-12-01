const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    mode: "production",
    content: ["./output/**/*.html"],
  },
  theme: {
    extend: {
      skew: {
        '1': '-1deg',
      },
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
    require('@tailwindcss/ui'),
  ],
};
