/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#F4D068',
          DEFAULT: '#D4AF37',
          dark: '#AA7C11',
        },
        cream: {
          light: '#FDFBF7',
          DEFAULT: '#F4EFE6',
          dark: '#EADFC9',
        },
        bronze: {
          DEFAULT: '#8C6239',
        },
        earth: {
          light: '#2A1A0A',
          DEFAULT: '#1A0F06',
          dark: '#0C0602',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
