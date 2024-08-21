import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-bg': 'radial-gradient(circle, hsl(272, 86%, 48%), hsl(311, 30%, 74%))',
      },
      
      
    },
  },
  plugins: [],
};
export default config;
