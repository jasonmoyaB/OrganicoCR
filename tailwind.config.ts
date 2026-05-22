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
          cream: '#F8F8F8',
          green: '#337418',
          lime: '#5DD62C',
          dark: '#202020',
          black: '#0F0F0F',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
