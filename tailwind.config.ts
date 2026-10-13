import type { Config } from 'tailwindcss';

// Brand palette. `accent` (#208ADE) and `accent-light` (#359BEA) are the brand blues;
// `accent-strong` is a darker shade of the same hue used for text and buttons so they
// meet WCAG AA contrast against white.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#2D3955',
        muted: '#5A6478',
        line: '#B6BAC2',
        paper: '#FAFBFC',
        accent: {
          DEFAULT: '#208ADE',
          light: '#359BEA',
          strong: '#176DB3',
          soft: '#E8F3FC',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '72rem',
      },
    },
  },
  plugins: [],
};

export default config;
