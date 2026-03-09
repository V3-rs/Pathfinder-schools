import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dream: {
          50: "#fdf8ff",
          100: "#f9e8fe",
          200: "#f3d0fc",
          300: "#e9a8f7",
          400: "#db72ef",
          500: "#c84de0",
          600: "#a82fc2",
          700: "#89259e",
          800: "#702382",
          900: "#5f206b",
        },
      },
      fontFamily: {
        sans: ["system-ui", "sans-serif"],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
