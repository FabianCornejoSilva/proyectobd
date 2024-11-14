// tailwind.config.js
module.exports = {
  content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {
          colors: {
              primary: '#3B82F6', // Color primario
              secondary: '#FBBF24', // Color secundario
              error: '#EF4444', // Color de error
          },
      },
  },
  plugins: [],
};
