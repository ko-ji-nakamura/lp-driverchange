import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 14px 36px rgba(15, 23, 42, 0.12)",
        cta: "0 10px 24px rgba(234, 88, 12, 0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
