/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "green": "#1D8954",

        "primary": "#ffffff",
        "light-black": "#282828",
        "secondary": "#b3b3b3",
        "gray": "#535353",
        "black-base": "#121212",
        "black-primary": "#191414",
        "black-secondary": "#171818",
      },
      gridTemplateColumns: {
        'auto-fill-cards': 'repeat(auto-fill, minmax(200px, 1fr))'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
