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
        primary: {
          DEFAULT: "#352f2b",
          container: "#4c4541",
          fixed: "#ece0db",
        },
        secondary: {
          DEFAULT: "#626034",
          container: "#e5e2aa",
          fixed: "#e8e5ad",
        },
        tertiary: {
          DEFAULT: "#402d00",
          container: "#5c4200",
          fixed: "#ffdea4",
        },
        surface: {
          DEFAULT: "#fff8f1",
          bright: "#fff8f1",
          dim: "#e4d9c3",
          container: "#f9edd7",
          "container-low": "#fef2dc",
          "container-high": "#f3e7d1",
          "container-highest": "#ede1cc",
          "container-lowest": "#ffffff",
        },
        "espresso-deep": "#2F2B28",
        "sage-muted": "#AEAC78",
        "amber-honey": "#F2C46A",
        "cream-canvas": "#FCF0DA",
        "canvas-white": "#FFFFFF",
        "on-surface": "#201b0e",
        "on-surface-variant": "#4d4540",
        "outline-variant": "#d0c4be",
        outline: "#7f7570",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        full: "9999px",
      },
      spacing: {
        gutter: "1.25rem",
        "gutter-mobile": "0.75rem",
        margin: "2rem",
        "margin-mobile": "1rem",
      },
    },
  },
  plugins: [],
};
export default config;
