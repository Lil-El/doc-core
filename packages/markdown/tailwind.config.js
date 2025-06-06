import customTypography from "./typography-options.js";

export default {
  content: ["./node_modules/@lil-el/**/*.{js}"],
  theme: {
    extend: {
      typography: () => customTypography,
    },
  },
  plugins: [],
};
