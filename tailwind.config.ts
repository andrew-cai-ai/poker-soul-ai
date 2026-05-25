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
        casino: {
          black: "#0a0a0f",
          dark: "#12121a",
          card: "#1a1a28",
          gold: "#d4af37",
          "gold-light": "#f0d78c",
          crimson: "#8b1538",
          purple: "#4a1a6b",
          felt: "#0d3d2e",
        },
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "var(--font-body-zh)", "serif"],
        body: ["var(--font-body-zh)", "PingFang SC", "Microsoft YaHei", "serif"],
      },
      backgroundImage: {
        "felt-pattern":
          "radial-gradient(ellipse at center, rgba(13,61,46,0.15) 0%, transparent 70%)",
        "gold-shimmer":
          "linear-gradient(135deg, rgba(212,175,55,0.1) 0%, transparent 50%, rgba(212,175,55,0.05) 100%)",
      },
      animation: {
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
