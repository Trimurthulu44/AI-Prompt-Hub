/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0a232b',
          teal: '#0f3d47',
          lightTeal: '#164e63',
          accent: '#f59e0b',
          accentHover: '#d97706',
          orange: '#ea580c',
          green: '#10b981',
          red: '#ef4444',
          blue: '#3b82f6',
          slate: '#64748b',
        }
      }
    },
  },
  plugins: [],
}
