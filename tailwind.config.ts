import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          cream: '#F6FEF9',
          green: '#003023',
          lime: '#83C441',
          dark: '#202020',
          black: '#0F0F0F',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
