/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#38bdf8",
        secondary: "#0f172a",
        accent: "#1e293b",
        success: "#10b981",
        danger: "#ef4444",
      },
      backgroundImage: {
        'dashboard-gradient': 'linear-gradient(to bottom right, #0f172a, #020617)',
      }
    },
  },
  plugins: [],
}
