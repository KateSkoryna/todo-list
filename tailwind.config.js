/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/todo/src/**/*.{js,jsx,ts,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        'base-bg': '#F1F2EE',
        'secondary-bg': '#BFB7B6',
        'accent': '#DCF763',
        'dark-bg': '#435058',
        'secondary-dark-bg': '#848C8E',
      },
    },
  },
  plugins: [],
};
