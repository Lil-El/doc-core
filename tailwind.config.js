import tailwindScrollbarHide from "tailwind-scrollbar-hide";

export default {
  content: ["./packages/**/*.{vue,js,html}"],
  theme: {
    extend: {},
  },
  plugins: [tailwindScrollbarHide()],
};
