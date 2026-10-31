/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'], // big numbers and headlines
      },
      colors: {
        primary: v('primary'),
        secondary: v('secondary'),
        accent: v('accent'),
        highlight: v('highlight'),
        canvas: v('bg'),
        ink: v('text'),
        surface: '#FFFFFF',
      },
    },
  },
  plugins: [],
}
