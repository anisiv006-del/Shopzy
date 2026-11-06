export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1f7a5d",
        "primary-dark": "#145b45",
        accent: "#eaf6f0",
        soft: "#f4f8f5",
      },
      boxShadow: {
        soft: "0 12px 30px rgba(31, 122, 93, 0.08)",
      },
    },
  },
  plugins: [],
};
