// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // This makes 'Poppins' your new default sans-serif font
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
        
        // This adds 'Playfair Display' as a new utility: 'font-display'
        display: ['Playfair Display', ...defaultTheme.fontFamily.serif],
      },
      // --- ADD THIS BLOCK ---
colors: {
  'brand-light': '#fdf0fa', // Mint White
  'brand-dark': '#334155',  // Dark Slate
  'brand-accent': '#b910ab', // Emerald Green
}
      // ----------------------
    },
  },
  plugins: [],
}