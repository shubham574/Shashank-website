import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",     // App Router
    "./pages/**/*.{js,ts,jsx,tsx}",   // Pages Router
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       colors: {
        brandRed: "#cf2f23", // tweak to match your red
      },
       borderRadius: {
        card: "22px",
      },
      animation: {
        "pulse-slow": "pulse 3s infinite",
      },
      },
    },
  
  plugins: [
    require("tw-animate-css"), // optional if you use animate.css
  ],
};

export default config;
