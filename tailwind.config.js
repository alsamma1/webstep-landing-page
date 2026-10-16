/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // WebStep Brand Colors
        green: {
          DEFAULT: '#1F8A54',
          50:  '#E8F5EE',
          100: '#C5E6D4',
          200: '#9DD4B5',
          300: '#70C290',
          400: '#3EAE6F',
          500: '#1F8A54',
          600: '#1A7447',
          700: '#145D39',
          800: '#0E472B',
          900: '#08311D',
        },
        black: {
          DEFAULT: '#0A0A0A',
          soft: '#111111',
          card: '#161616',
          border: '#222222',
        },
        white: {
          DEFAULT: '#FFFFFF',
          soft: '#F8F8F8',
          muted: '#F0F0F0',
        },
        // Dark mode surfaces
        dark: {
          bg: '#0A0A0A',
          surface: '#111111',
          card: '#161616',
          border: '#222222',
          text: '#E8E8E8',
          muted: '#888888',
        },
      },
      fontFamily: {
        cairo: ['var(--font-cairo)', 'Cairo', 'sans-serif'],
        sans: ['var(--font-cairo)', 'Cairo', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
        'slide-in-left': 'slideInLeft 0.6s ease forwards',
        'slide-in-right': 'slideInRight 0.6s ease forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'typing': 'typing 3.5s steps(40, end)',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'wave': 'wave 0.5s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-40px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(40px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        glow: {
          from: { boxShadow: '0 0 20px rgba(31,138,84,0.3)' },
          to: { boxShadow: '0 0 40px rgba(31,138,84,0.7), 0 0 80px rgba(31,138,84,0.3)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        wave: {
          '0%': { transform: 'rotate(-15deg)' },
          '100%': { transform: 'rotate(15deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-light': 'radial-gradient(ellipse at top, rgba(31,138,84,0.08) 0%, transparent 60%)',
        'hero-dark': 'radial-gradient(ellipse at top, rgba(31,138,84,0.15) 0%, transparent 70%)',
        'grid-light': 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px)',
        'grid-dark': 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '60px 60px',
      },
      boxShadow: {
        'green': '0 0 30px rgba(31,138,84,0.3)',
        'green-lg': '0 0 60px rgba(31,138,84,0.4)',
        'card': '0 4px 30px rgba(0,0,0,0.06)',
        'card-dark': '0 4px 30px rgba(0,0,0,0.4)',
        'navbar': '0 1px 30px rgba(0,0,0,0.08)',
        'navbar-dark': '0 1px 30px rgba(0,0,0,0.6)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      screens: {
        'xs': '375px',
        '3xl': '1920px',
        '4xl': '2560px',
      },
    },
  },
  plugins: [],
}
