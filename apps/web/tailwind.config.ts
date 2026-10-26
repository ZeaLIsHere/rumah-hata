import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        aksara: ['"Noto Sans Batak"', "Batak", "sans-serif"]
      },
      colors: {
        batak: {
          red: "#8b1e1b",
          redDark: "#6b1412",
          black: "#18181b",
          gold: "#b45309",
          cream: "#fdfbf7"
        }
      }
    }
  },
  plugins: []
};

export default config;
