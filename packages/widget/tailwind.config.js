/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  prefix: 'fw-', // Prefix semua class Tailwind untuk menghindari konflik dengan host website
  important: true,
  theme: {
    extend: {},
  },
  plugins: [],
}
