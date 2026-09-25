/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#09090b',
        surface: '#111113',
        panel: '#18181b',
        line: '#27272a',
        accent: '#a3e635',
      },
      boxShadow: {
        glow: '0 0 70px rgba(163, 230, 53, 0.12)',
      },
    },
  },
  plugins: [],
}