/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,html}',
    './src/components/*.vue'
  ],
  theme: {
    fontFamily: {
      sans: ['Noto Sans Mono', 'sans-serif']
    },
    extend: {
      fontFamily: {
        'noto-sans-mono': ['Noto Sans Mono', 'monospace'],
        'syne-mono': ['Syne Mono', 'monospace']
      }
    }
  },
  plugins: []
}
