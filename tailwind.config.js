import {heroui} from "@heroui/react";
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
      "./src/**/*.{js,ts,jsx,tsx}",
      "./src/Components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
      "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"

  ],
  theme: {
    extend: {},
  },
    plugins: [heroui()]
}

