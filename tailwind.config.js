/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mystic: {
          950: '#0a0a0f',
          900: '#12121c',
          800: '#1c1c2e',
          700: '#2a2a40',
          600: '#3d3d5c',
        },
        orange: {
          400: '#f6ad55',
          500: '#ed8936',
          600: '#dd6b20',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
