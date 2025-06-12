module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        playfair: ['"Playfair Display"', "serif"],
      },
    },
  },
  corePlugins: {
    lineHeight: true, // Ensure it's enabled
  },
  plugins: [],
};
