export default {
  theme: {
    screens: {
      sm: '413px',
      smd: '550px',
      md: '768px',
      lg: '960px',
      lgp: '1200px',
      xl: '1440px',
    },
    colors: {
      blue: {
        DEFAULT: '#97D7ED',
        dark: '#0857A6',
      },
      green: {
        DEFAULT: '#B4F8CC',
        dark: '#4F8F45',
      },
      purple: {
        DEFAULT: '#D6C5F7',
        dark: '#7249C3',
      },
      red: {
        DEFAULT: '#FFC2CB',
        dark: '#A53D4C',
      },
      yellow: {
        DEFAULT: '#FFE5A8',
        dark: '#DD8B11',
      },
      grey: {
        DEFAULT: '#2E2E2E',
        dark: '#1E1E1E',
        medium: '#787878',
        'med-light': '#e8e5de',
        light: '#f7f7f7',
      },
      white: '#FFFFFF',
      black: '#000000',
      transparent: 'transparent',
      current: 'currentColor',
    },
    fontFamily: {
      sans: ['Inter', 'Segoe UI', 'Roboto', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
    },
    extend: {
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      colors: {
        gray: {
          '900': '#111827'
        }
      }
    },
  },
  safelist: [
    'bg-blue',
    'bg-blue-dark',
    'bg-green',
    'bg-green-dark',
    'bg-purple',
    'bg-purple-dark',
    'bg-red',
    'bg-red-dark',
    'bg-yellow',
    'bg-yellow-dark',
    'text-blue',
    'text-blue-dark',
    'text-green',
    'text-green-dark',
    'text-purple',
    'text-purple-dark',
    'text-red',
    'text-red-dark',
    'text-yellow',
    'text-yellow-dark',
    'bg-[#97D7ED]',
    'bg-[#0857A6]',
    'bg-[#B4F8CC]',
    'bg-[#4F8F45]',
    'bg-[#D6C5F7]',
    'bg-[#7249C3]',
    'bg-[#FFC2CB]',
    'bg-[#A53D4C]',
    'bg-[#FFE5A8]',
    'bg-[#DD8B11]',
    'text-[#97D7ED]',
    'text-[#0857A6]',
    'text-[#B4F8CC]',
    'text-[#4F8F45]',
    'text-[#D6C5F7]',
    'text-[#7249C3]',
    'text-[#FFC2CB]',
    'text-[#A53D4C]',
    'text-[#FFE5A8]',
    'text-[#DD8B11]',
    'max-w-3xl',
    'max-w-2xl',
    'max-w-[365px]',
    'md:grid-cols-1',
    'md:grid-cols-2',
    'md:grid-cols-3',
    'md:grid-cols-4',
    'featured-review'
  ],
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}