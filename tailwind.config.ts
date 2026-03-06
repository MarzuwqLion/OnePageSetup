import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cosmic: {
          orange: '#FF6B35',
          'orange-dark': '#CC5228',
          'orange-hover': '#B34820',
          'orange-active': '#993D1A',
          'orange-light': '#FF8C5A',
          'orange-bg': '#FFF3EE',
          'orange-bg-active': '#FFE8DC',
        },
        apple: {
          bg: '#F5F5F7',
          text: '#1D1D1F',
          secondary: '#6E6E73',
          dark: '#1D1D1F',
          border: '#E5E5E7',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Segoe UI"',
          'sans-serif',
        ],
      },
      screens: {
        xs: '320px',
        sm: '375px',
        md: '768px',
        lg: '1024px',
        xl: '1440px',
        '2xl': '1920px',
      },
    },
  },
  plugins: [],
}

export default config
