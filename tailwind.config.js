const konstaConfig = require('konsta/config')

module.exports = konstaConfig({
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'mb-background': '#070C2B',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
})
