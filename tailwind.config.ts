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
        // Monis brand palette — warm cream + charcoal + amber accent
        canvas: {
          DEFAULT: "#F5F0E8",
          dark: "#EDE8DC",
        },
        ink: {
          DEFAULT: "#1C1A17",
          soft: "#3D3A35",
          muted: "#7A7570",
        },
        amber: {
          DEFAULT: "#E8A020",
          light: "#F5C050",
          dark: "#C47A10",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          raised: "#FAF8F4",
          overlay: "rgba(28, 26, 23, 0.55)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        card: "0 2px 8px rgba(28,26,23,0.08), 0 0 0 1px rgba(28,26,23,0.06)",
        "card-hover":
          "0 8px 24px rgba(28,26,23,0.12), 0 0 0 1px rgba(28,26,23,0.08)",
        panel: "0 4px 32px rgba(28,26,23,0.14), 0 0 0 1px rgba(28,26,23,0.06)",
        float: "0 16px 48px rgba(28,26,23,0.18)",
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease-out both",
        "fade-in": "fadeIn 0.3s ease-out both",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
};

export default config;
