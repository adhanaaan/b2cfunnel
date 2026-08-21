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
        // "Ember Night" palette (event2 arena arc + TV board). Warm
        // brown-black ink, never pure black; the brand orange glows on it.
        night: {
          ink: "#1a1210",
          deep: "#120c0a",
          raised: "#261812",
          stroke: "#3e2a1f",
        },
        ember: {
          core: "#f77528", // brand primary, unchanged
          bright: "#ff9a4d",
          hot: "#ffc29e",
          shadow: "#7a2e0c",
        },
        cream: {
          DEFAULT: "#fff4ec",
          dim: "#d8b9a6",
          faint: "#a8877a",
        },
        gold: "#f7c15c",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      borderRadius: {
        // "Round Eight" - 8px default roundness
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
      },
      boxShadow: {
        // Floating cards with soft shadows
        card: "0 8px 24px -8px rgba(51, 18, 0, 0.12), 0 2px 8px -2px rgba(51, 18, 0, 0.08)",
        float: "0 16px 40px -12px rgba(51, 18, 0, 0.18)",
        // Night-theme elevation is a glow, not a drop shadow.
        ember:
          "0 0 0 1px #3e2a1f, 0 12px 40px -12px rgba(247, 117, 40, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
