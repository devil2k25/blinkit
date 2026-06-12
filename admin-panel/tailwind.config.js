/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0c831f',
        'primary-dark': '#096b19',
        accent: '#f8c200',
        'sidebar-bg': '#1a1a2e',
        'sidebar-hover': '#16213e',
      }
    },
  },
  plugins: [],
}
