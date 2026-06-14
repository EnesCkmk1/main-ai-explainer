import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F6F4EF",
        surface: "#FFFFFF",
        ink: "#16191F",
        muted: "#5C6573",
        line: "#E6E1D7",
        accent: {
          DEFAULT: "#1F6F5C",
          soft: "#E7F1ED",
          ink: "#13473B",
        },
        amber: {
          DEFAULT: "#B7791F",
          soft: "#FBF1DD",
        },
        danger: {
          DEFAULT: "#B4453B",
          soft: "#F8E7E4",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,25,31,0.04), 0 12px 32px -12px rgba(22,25,31,0.12)",
        lift: "0 2px 4px rgba(22,25,31,0.05), 0 24px 48px -16px rgba(22,25,31,0.18)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
