import type { Config } from "tailwindcss";

// Les couleurs de la marque sont définies une seule fois, dans src/app/globals.css (variables --c-*).
const couleur = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: couleur("--c-paper"),
        ink: couleur("--c-ink"),
        muted: couleur("--c-muted"),
        line: couleur("--c-line"),
        bleu: couleur("--c-bleu"),
        orange: couleur("--c-orange"),
        corail: couleur("--c-corail"),
        gris: couleur("--c-gris"),
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', "system-ui", "sans-serif"],
        sans: ['"Instrument Sans Variable"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
