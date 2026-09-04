/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'midnight-bg': '#0F172A',
        'midnight-surface': '#1E293B',
        'midnight-primary': '#38BDF8',
        'midnight-secondary': '#818CF8',
        'midnight-accent': '#22C55E',
        'midnight-text': '#F8FAFC',
        'luxury-bg': '#111827',
        'luxury-primary': '#A855F7',
        'luxury-secondary': '#EC4899',
        'luxury-accent': '#FBBF24',
        'luxury-text': '#FFFFFF',
        'light-bg': '#FFFFFF',
        'light-primary': '#2563EB',
        'light-secondary': '#14B8A6',
        'light-accent': '#F97316',
        'light-text': '#1E293B',
        'rose-bg': '#1A1A1A',
        'rose-primary': '#D4A373',
        'rose-secondary': '#FFD6A5',
        'rose-accent': '#E76F51',
        'rose-text': '#FAFAFA',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
