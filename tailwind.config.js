/**
 * Tailwind configuration holding the CROP design tokens taken from the Figma
 * style guide: Primary #0F4D10, Secondary #4CAF50, Tertiary #F4C04E,
 * Neutral #2E2E2E and the Plus Jakarta Sans type family.
 *
 * RTL note: every component uses logical utilities (ms-, me-, ps-, pe-,
 * text-start, text-end, start-, end-) so flipping the document direction
 * mirrors the layout without any component-level branching.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EEF7EE", 100: "#D6EDD6", 200: "#B0DBB0", 300: "#85C585", 400: "#5AAA5C",
          500: "#2F8A31", 600: "#1E6F20", 700: "#0F4D10", 800: "#0B3A0C", 900: "#072A08", 950: "#041A05",
          DEFAULT: "#0F4D10",
        },
        secondary: {
          50: "#F0FAF1", 100: "#DDF3DE", 200: "#BBE7BD", 300: "#8FD693", 400: "#66C26B",
          500: "#4CAF50", 600: "#3A9040", 700: "#2E7433", 800: "#265C2A", 900: "#1E4A22",
          DEFAULT: "#4CAF50",
        },
        tertiary: {
          50: "#FEF8E8", 100: "#FCEFC4", 200: "#F9E19A", 300: "#F6D175", 400: "#F4C04E",
          500: "#D9A333", 600: "#B3822A", 700: "#8A6420", 800: "#66481A", 900: "#3F2C10",
          DEFAULT: "#F4C04E",
        },
        neutral: {
          50: "#F5F5F4", 100: "#EAEAE9", 200: "#D4D4D3", 300: "#B8B8B7", 400: "#8E8E8D",
          500: "#6B6B6A", 600: "#4D4D4C", 700: "#3A3A39", 800: "#2E2E2E", 900: "#1F1F1F",
          DEFAULT: "#2E2E2E",
        },
        surface: { DEFAULT: "#FCFBF9", card: "#EFEFED", muted: "#F4F3F0" },
        risk: {
          low: "#2E9E4F", lowText: "#1E7B34", lowBg: "#EAF6EC",
          mid: "#E9B949", midText: "#A8780F", midBg: "#FCF3DC",
          high: "#B3261E", highText: "#B3261E", highBg: "#FBE6E3",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Arabic"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: { xl3: "1.5rem", xl4: "2rem" },
      boxShadow: {
        card: "0 8px 30px rgba(0, 0, 0, 0.18)",
        pill: "0 2px 10px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};
