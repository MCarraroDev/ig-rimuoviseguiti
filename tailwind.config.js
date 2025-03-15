/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-dark': '#212121',
        'card-dark': '#424242',
        'primary': '#4285f4',
        'success': '#4caf50'
      }
    },
  },
  plugins: [],
}
