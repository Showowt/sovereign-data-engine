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
        sovereign: {
          bg: "#06050A",
          surface: "#0C0B12",
          card: "#11101A",
          elevated: "#161525",
          border: "#1C1B28",
          borderActive: "#2A293A",
        },
        gold: {
          DEFAULT: "#C8A45E",
          dim: "#8B7340",
          bright: "#E8C96E",
          glow: "rgba(200, 164, 94, 0.15)",
        },
        cyan: {
          DEFAULT: "#3ECFCF",
          dim: "#1A6B6B",
          glow: "rgba(62, 207, 207, 0.15)",
        },
        text: {
          DEFAULT: "#E8E0D0",
          muted: "#6B6580",
          dim: "#4A4560",
        },
        status: {
          hot: "#FF6B6B",
          warm: "#FFB347",
          cold: "#6B8EFF",
          qualified: "#4AE68C",
        },
      },
      fontFamily: {
        serif: ["'Instrument Serif'", "Georgia", "serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
      },
      boxShadow: {
        "gold-glow": "0 0 40px rgba(200, 164, 94, 0.15)",
        "cyan-glow": "0 0 40px rgba(62, 207, 207, 0.15)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-gold": "linear-gradient(135deg, #C8A45E 0%, #E8C96E 100%)",
        "gradient-surface": "linear-gradient(180deg, #0C0B12 0%, #06050A 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { opacity: "0.5" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
