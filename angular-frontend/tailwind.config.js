/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dark"],
  },
  safelist: [
    {
      pattern: /alert-.+/,
    },
    {
      pattern: /w-.+/,
    },
    {
      pattern: /h-.+/,
    }
  ]
}