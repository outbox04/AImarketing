import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#F5F7FB",
        surface: "#FFFFFF",
        "surface-soft": "#F9FAFB",
        border: "#E5E7EB",
        "text-main": "#111827",
        "text-muted": "#6B7280",
        "text-soft": "#9CA3AF",
        primary: "#4F46E5",
        "primary-soft": "#EEF2FF",
        success: "#22C55E",
        "success-soft": "#DCFCE7",
        warning: "#F59E0B",
        "warning-soft": "#FEF3C7",
        danger: "#EF4444",
        "danger-soft": "#FEE2E2",
        info: "#0EA5E9",
        "info-soft": "#E0F2FE"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.06)",
        card: "0 10px 30px rgba(15, 23, 42, 0.05)"
      },
      borderRadius: {
        card: "22px"
      }
    }
  },
  plugins: []
};

export default config;
