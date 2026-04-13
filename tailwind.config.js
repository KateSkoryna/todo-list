/** @type {import('tailwindcss').Config} */
const colors = require('./theme/colors');

module.exports = {
  content: ['./apps/todo/src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: { colors },
  },
  plugins: [],
};
