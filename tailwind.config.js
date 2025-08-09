/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '200px',
      },
      fontFamily: {
        'Reddit': ["Reddit Mono", "monospace"]
      },
      colors: {
        "mainBackground": "#0b1220",
        "btnBgColor": "#3b82f6",
        "bgFromGrad": "#09203f"
      }
    },
  },
  plugins: [],
});

