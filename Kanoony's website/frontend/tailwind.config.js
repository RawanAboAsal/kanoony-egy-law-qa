/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#21212e', // Navy blue color
          light: '#21212e',
        },
        secondary: {
          DEFAULT: '#F1EFEC', // Beige/cream color
          dark: '#F1EFEC',
        },
        'third': '#1F2937',
        'fourth': '#FBF7EE',
        'accent': '#C6A45C',
      }
    },
  },
  plugins: [],
};