/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#05070D',
          900: '#0A0E17',
          800: '#111726',
          700: '#1A2235',
          600: '#28344C',
        },
        signal: {
          cyan: '#2DE2E6',
          violet: '#8C6BFA',
          amber: '#FFB86B',
          rose: '#FF5C7A',
        },
        ink: {
          100: '#EDEFF7',
          300: '#B7BEDA',
          500: '#7C87AD',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(180deg, rgba(45,226,230,0.06) 0%, rgba(5,7,13,0) 60%), radial-gradient(60% 60% at 50% 0%, rgba(140,107,250,0.14) 0%, rgba(5,7,13,0) 70%)',
        scanline:
          'repeating-linear-gradient(0deg, rgba(45,226,230,0.05) 0px, rgba(45,226,230,0.05) 1px, transparent 1px, transparent 3px)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(45,226,230,0.15), 0 0 24px rgba(45,226,230,0.12)',
        'glow-violet': '0 0 0 1px rgba(140,107,250,0.2), 0 0 24px rgba(140,107,250,0.16)',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
      },
      animation: {
        sweep: 'sweep 3.2s linear infinite',
        pulseDot: 'pulseDot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
