/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../apps/web/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0a',
          surface: '#171717',
          primary: '#3b82f6',
          secondary: '#6b7280',
          accent: '#8b5cf6',
          text: '#ededed',
          'text-secondary': '#9ca3af',
        },
      },
    },
  },
  plugins: [],
}; 