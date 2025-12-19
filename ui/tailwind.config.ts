import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: { DEFAULT: "#050505", surface: "#0a0a0a", border: "#1a1a1a" },
        gold: { DEFAULT: "#D4AF37", dim: "rgba(212, 175, 55, 0.4)", glow: "rgba(212, 175, 55, 0.15)" }
      },
      fontFamily: {
        mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
};
export default config;