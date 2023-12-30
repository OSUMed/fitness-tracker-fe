/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#607D8B", // Primary Color
        secondary: {
          green: "#4CAF50", // Pastel Green
          gray: "#E0E0E0", // Gentle Gray
        },
        accent: "#FFEB3B", // Sunshine Yellow
        charcoal: "#333333", // Charcoal Black
      },
    },
  },
  plugins: [],
};
