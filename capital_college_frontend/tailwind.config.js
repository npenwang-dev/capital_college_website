/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        college: {
          navy: '#002858',
          'navy-dark': '#001b3d',
          gold: '#4a6b28',
          'gold-hover': '#3d5920',
          'gold-light': '#f4f8ed',
          green: '#4a6b28',
          'green-dark': '#3d5920',
          'green-light': '#648d35',
          'green-sage': '#b5d697',
          orange: '#4a6b28',
          'orange-hover': '#3d5920',
          maroon: '#8a1818',
          gray: '#32373c',
          light: '#f8f9fa'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Poppins', 'sans-serif'],
        outfit: ['Outfit', 'Poppins', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Playfair Display', 'Georgia', 'serif'],
        display: ['Cinzel', 'Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
