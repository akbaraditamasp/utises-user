module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          base: "#1572A1",
          shade: "#115b81",
          tint: "#d0e3ec",
          background: "#deebf2",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
