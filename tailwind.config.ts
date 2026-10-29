import type { Config } from "tailwindcss";

const c = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: c("--paper"),
        ink: c("--ink"),
        pane: c("--pane"),
        muted: c("--muted"),
        violet: c("--violet"),
        poppy: c("--poppy"),
      },
      fontFamily: {
        display: ['"DM Sans"', "system-ui", "sans-serif"],
        body: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      maxWidth: { page: "78rem", prose: "38rem" },
    },
  },
  plugins: [],
} satisfies Config;
