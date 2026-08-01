const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Semantic name so the accent is a one-line rebrand later, rather than `indigo-*`
        // scattered through every component.
        primary: colors.indigo,
      },
      keyframes: {
        'modal-in': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'backdrop-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'check-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'row-highlight': {
          '0%': { backgroundColor: colors.indigo[50] },
          '100%': { backgroundColor: 'transparent' },
        },
      },
      animation: {
        'modal-in': 'modal-in 150ms ease-out',
        'backdrop-in': 'backdrop-in 150ms ease-out',
        'check-in': 'check-in 150ms ease-out',
        'row-highlight': 'row-highlight 1.4s ease-out',
      },
    },
  },
  plugins: [],
}
