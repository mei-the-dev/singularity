import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: { 
    extend: { 
      colors: { space: "#030014", starlight: "#e2e8f0", void: "#000000" },
      animation: { 'spin-slow': 'spin 20s linear infinite' }
    } 
  },
  plugins: [],
};
export default config;