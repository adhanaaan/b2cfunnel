import type { Config } from "tailwindcss";

/**
 * Clinical Empathy design system.
 * Light theme. Plus Jakarta Sans. 8px roundness. Primary orange #f77528.
 * Palette balances clinical authority with warmth ("IG-quiz" peach surfaces).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        // Height-based variants used by the ported symbol-matching game.
        tall: { raw: "(min-height: 720px)" },
        "tall-lg": { raw: "(min-height: 786px)" },
      },
      colors: {
        // Brand & interactive
        primary: {
          DEFAULT: "#f77528",
          on: "#ffffff",
          container: "#ffdbcb",
          onContainer: "#331200",
        },
        secondary: {
          DEFAULT: "#7d5747",
          on: "#ffffff",
        },
        tertiary: {
          DEFAULT: "#6c5d2e",
          on: "#ffffff",
        },
        // Surfaces
        surface: {
          DEFAULT: "#fff8f6",
          dim: "#ecd5cc",
          bright: "#fff8f6",
          lowest: "#ffffff",
          low: "#fff1eb",
          container: "#fbe7de",
          high: "#f9ddcf",
          highest: "#f7d2c1",
        },
        // Status & feedback
        error: {
          DEFAULT: "#ba1a1a",
          on: "#ffffff",
        },
        outline: {
          DEFAULT: "#85736b",
          variant: "#d8c2b9",
        },
        // Editorial / structural extras from the build brief
        charcoal: "#2d2d2d",
        // "What's driving this" factor pills
        pill: {
          text: "#993c1d",
          bg: "#faece7",
        },
        // Gauge band colours (low -> high)
        gauge: {
          low: "#97c459",
          moderate: "#fac775",
          elevated: "#ef9f27",
          high: "#f09595",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        // "Round Eight" — 8px default roundness
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
      },
      boxShadow: {
        // Floating cards with soft shadows
        card: "0 8px 24px -8px rgba(51, 18, 0, 0.12), 0 2px 8px -2px rgba(51, 18, 0, 0.08)",
        float: "0 16px 40px -12px rgba(51, 18, 0, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
