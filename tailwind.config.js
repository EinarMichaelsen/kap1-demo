/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // KAP1 brand palette (taken from the brand stills)
        maroon: {
          DEFAULT: "#7d3f40",
          dark: "#6b3637",
          deep: "#5a2d2e",
        },
        brand: {
          orange: "#f97316",
          yellow: "#ffd60a",
        },
      },
      fontFamily: {
        display: ["var(--font-anton)", "Impact", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
