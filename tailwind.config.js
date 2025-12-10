/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Lo-Fi Dark Mode (The Study Room)
        "warm-charcoal": "#1c1b19",
        "charcoal-card": "#232220",
        "charcoal-border": "#3e3b36",
        "ivory-white": "#e0d8cc",
        "ivory-muted": "#8a847a",
        "sage-green": "#7f9e96",

        // Lo-Fi Light Mode (The Archive)
        "old-paper": "#e8e4dc",
        "paper-card": "#f2efe9",
        "paper-border": "#d1cdc5",
        "faded-ink": "#2c2b29",
        "ink-muted": "#78756e",
        "sage-dark": "#5c7c74",

        // Muted Priority Colors (for tasks/labels)
        "priority-high": "#c47d7d", // Muted red (terracotta)
        "priority-medium": "#d4b787", // Muted yellow (sand)
        "priority-low": "#8b9d8a", // Muted green (moss)
      },
      fontFamily: {
        serif: ["Lora", "serif"],
        mono: ["Courier Prime", "monospace"],
        hand: ["Homemade Apple", "cursive"],
      },
      borderRadius: {
        subtle: "2px", // Minimal rounding for lo-fi aesthetic
        none: "0", // Sharp corners
      },
      boxShadow: {
        subtle: "0 2px 4px rgba(0, 0, 0, 0.05)", // Very subtle shadow
        paper: "0 1px 2px rgba(0, 0, 0, 0.08)", // Paper-like shadow
        none: "none", // No shadow
      },
      animation: {
        "slow-fade": "fadeIn 1.2s ease-out",
        "gentle-fade": "fadeIn 0.8s ease-out",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      transitionDuration: {
        slow: "500ms", // Minimum for lo-fi feel
        slower: "700ms", // For important transitions
        slowest: "1000ms", // For page transitions
      },
      transitionTimingFunction: {
        gentle: "cubic-bezier(0.4, 0, 0.2, 1)", // Gentle easing
      },
      borderStyle: {
        dashed: "dashed",
      },
    },
  },
  plugins: [],
};
