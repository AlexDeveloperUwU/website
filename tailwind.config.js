/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{ejs, html, css}"],
  theme: {
    extend: {
      colors: {},
      fontFamily: {
        mono: [
          '"JetBrains Mono"',
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          "monospace",
        ],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
  ],
};
