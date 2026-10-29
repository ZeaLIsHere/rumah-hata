import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Inter"',
          "system-ui",
          "sans-serif"
        ],
        aksara: ['"Noto Sans Batak"', "Batak", "sans-serif"]
      },
      colors: {
        apple: {
          primary: "#0066cc",
          primaryFocus: "#0071e3",
          primaryDark: "#2997ff",
          ink: "#1d1d1f",
          body: "#1d1d1f",
          canvas: "#ffffff",
          parchment: "#f5f5f7",
          pearl: "#fafafc",
          tile1: "#272729",
          tile2: "#2a2a2c",
          tile3: "#252527",
          hairline: "#e0e0e0",
          hairlineDark: "rgba(255, 255, 255, 0.12)"
        }
      },
      borderRadius: {
        sm: "8px",
        md: "11px",
        lg: "18px",
        pill: "9999px"
      },
      letterSpacing: {
        tightDisplay: "-0.025em",
        tightBody: "-0.015em"
      }
    }
  },
  plugins: []
};

export default config;
