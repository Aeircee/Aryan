import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── BRUTALIST COLOR PALETTE ─────────────────────────────────────────────
      colors: {
        vintage: {
          paper:  "#f0ede6",   // main background – off-white/cream
          cream:  "#ebe8e0",   // subtle section alternates
          dark:   "#1a1a1a",   // near-black body text
          black:  "#000000",   // pure black – borders & headings
          grey:   "#c0c0c0",   // Windows 95 taskbar grey
          grey2:  "#808080",   // Win95 shadow / darker accents
          accent: "#e8e4d4",   // slightly deeper paper for cards
          stamp:  "#8b1a1a",   // red-ish for receipt totals / stamps
        },
        win95: {
          bg:         "#c0c0c0",
          highlight:  "#ffffff",
          shadow:     "#808080",
          darkShadow: "#404040",
          blue:       "#000080",
          taskbar:    "#c0c0c0",
        },
      },

      // ─── TYPOGRAPHY ──────────────────────────────────────────────────────────
      fontFamily: {
        sans:  ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono:  [
          "\"Courier Prime\"",
          "\"Fira Code\"",
          "\"Courier New\"",
          "Courier",
          "monospace",
        ],
        // Keep SF Pro variable if ever used
        sfpro: ["var(--font-sf-pro)", "ui-sans-serif", "sans-serif"],
      },

      // ─── SPACING TOKENS ──────────────────────────────────────────────────────
      spacing: {
        "px-brutalist": "2px",
      },

      // ─── BORDER RADIUS ───────────────────────────────────────────────────────
      borderRadius: {
        none:      "0px",        // Brutalist: sharp corners everywhere
        "win95":   "0px",
      },

      // ─── BOX SHADOWS (BRUTALIST OFFSET) ──────────────────────────────────────
      boxShadow: {
        brutalist:    "4px 4px 0px #000000",
        "brutalist-lg":"6px 6px 0px #000000",
        "brutalist-sm":"2px 2px 0px #000000",
        "win95-raised":
          "inset -1px -1px 0 #404040, inset 1px 1px 0 #ffffff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf",
        "win95-sunken":
          "inset 1px 1px 0 #404040, inset -1px -1px 0 #ffffff, inset 2px 2px 0 #808080, inset -2px -2px 0 #dfdfdf",
      },

      // ─── KEYFRAMES ───────────────────────────────────────────────────────────
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%":   { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "spin-slow": {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "print-slide": {
          "0%":   { clipPath: "inset(0 0 100% 0)", opacity: "0" },
          "100%": { clipPath: "inset(0 0 0% 0)",   opacity: "1" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
      },

      // ─── ANIMATION UTILITIES ─────────────────────────────────────────────────
      animation: {
        marquee:           "marquee 20s linear infinite",
        "marquee-slow":    "marquee 40s linear infinite",
        "marquee-reverse": "marquee-reverse 25s linear infinite",
        "spin-slow":       "spin-slow 12s linear infinite",
        "print-slide":     "print-slide 1.2s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-up":         "fade-up 0.6s ease-out forwards",
        blink:             "blink 1.2s step-start infinite",
      },
    },
  },
  plugins: [],
};

export default config;
