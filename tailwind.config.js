/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./apps/todo/src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        'base-bg': '#FFFFFF',
        'secondary-bg': '#c6c6c6',
        accent: '#DCF763',
        'dark-bg': '#435058',
        'secondary-dark-bg': '#848C8E',
        'triadic-purple': '#8a4aeb',
        'triadic-orange': '#eb8a4a',
        'triadic-blue': '#4aabeb',
      },
    },
  },
  plugins: [],
};
