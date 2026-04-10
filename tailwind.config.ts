import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Inter",
          "Hiragino Sans",
          "Noto Sans JP",
          "sans-serif",
        ],
      },
      colors: {
        ink: {
          900: "#0a0a0a",
          700: "#333333",
          500: "#6b7280",
          300: "#d1d5db",
          100: "#f3f4f6",
          50: "#fafafa",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
        ring: "0 0 0 4px rgba(10,10,10,0.06)",
      },
      borderRadius: { xl2: "20px" },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: { rise: "rise 220ms ease-out both" },
    },
  },
  plugins: [],
};
export default config;
