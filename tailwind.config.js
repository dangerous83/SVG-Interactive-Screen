/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette
        'itsec-blue': '#0075c9',
        'itsec-orange': '#d2451e',
        'sv-cyan': '#33d6ff',
        'sv-orange': '#ff7a30',
        // Surface tones
        'void': '#03060f',
        'deep': '#060b1c',
        'navy': '#0a1430',
        'panel': '#0c1836',
      },
      fontFamily: {
        display: ['Orbitron', 'Rajdhani', 'system-ui', 'sans-serif'],
        sans: ['Rajdhani', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(0,117,201,0.35)',
        'glow-orange': '0 0 40px rgba(210,69,30,0.35)',
        'glow-cyan': '0 0 50px rgba(51,214,255,0.4)',
      },
      backgroundImage: {
        'cyber-grid':
          'linear-gradient(rgba(0,117,201,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,117,201,0.08) 1px, transparent 1px)',
      },
      animation: {
        'spin-slow': 'spin 40s linear infinite',
        'spin-reverse': 'spin-reverse 60s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'scan': 'scan 4s linear infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
