/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'gold': {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      // FIXED: Add mobile-first responsive breakpoints
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      animation: {
        'bounce-float': 'bounce-float 3s ease-in-out infinite',
      },
      keyframes: {
        'bounce-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}