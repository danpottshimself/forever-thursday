/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        emo: {
          black: '#000000',
          gray: '#333333',
          pink: '#000000',
          purple: '#000000',
          red: '#000000',
        },
        grunge: {
          dark: '#f5f5f5',
          medium: '#e0e0e0',
          light: '#cccccc',
        }
      },
      fontFamily: {
        'grunge': ['Creepster', 'cursive'],
        'emo': ['Permanent Marker', 'cursive'],
        'sketchy': ['Fredoka One', 'cursive'],
        'sketchy-alt': ['Fredoka', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'grunge-shake': 'grungeShake 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 105, 180, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 105, 180, 0.8)' },
        },
        grungeShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        }
      }
    },
  },
  plugins: [],
}