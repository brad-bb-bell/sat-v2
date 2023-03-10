/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,html}", "./src/components/*.vue"],
  theme: {
    extend: {
      fontFamily: {
        "syne-mono": ["Syne Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
