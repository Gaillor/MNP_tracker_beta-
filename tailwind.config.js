/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8e6',
          100: '#ffefcc',
          200: '#ffe099',
          300: '#ffd066',
          400: '#ffc133',
          500: '#ffbe33',
          600: '#cc982a',
          700: '#997220',
          800: '#664c15',
          900: '#33260b',
        },
      },
    },
  },
  plugins: [],
};