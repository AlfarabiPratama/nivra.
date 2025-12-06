/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Lo-Fi Dark Mode (The Study Room)
        'warm-charcoal': '#1c1b19',
        'charcoal-card': '#232220',
        'charcoal-border': '#3e3b36',
        'ivory-white': '#e0d8cc',
        'ivory-muted': '#8a847a',
        'sage-green': '#7f9e96',
        
        // Lo-Fi Light Mode (The Archive)
        'old-paper': '#e8e4dc',
        'paper-card': '#f2efe9',
        'paper-border': '#d1cdc5',
        'faded-ink': '#2c2b29',
        'ink-muted': '#78756e',
        'sage-dark': '#5c7c74',
      },
      fontFamily: {
        serif: ['Lora', 'serif'],
        mono: ['Courier Prime', 'monospace'],
        hand: ['Homemade Apple', 'cursive'],
      },
      animation: {
        'slow-fade': 'fadeIn 1.2s ease-out',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      borderStyle: {
        'dashed': 'dashed',
      }
    },
  },
  plugins: [],
}
