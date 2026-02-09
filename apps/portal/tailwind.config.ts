import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          base: '#08080a',
          card: '#111113',
          muted: '#0c0c0e',
          elevated: '#0f172a',
          input: '#334155',
        },
        accent: {
          primary: '#21808d',
          secondary: '#14b8a6',
          hover: '#0891b2',
          action: '#2563eb',
        },
        border: {
          DEFAULT: '#222228',
          subtle: '#333340',
        },
        text: {
          primary: '#e8e8ec',
          secondary: '#888893',
          muted: '#55555e',
        },
        status: {
          success: '#3d9970',
          warning: '#d4a843',
          danger: '#cc4444',
          crisis: '#b91c1c',
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Courier New'", 'monospace'],
        sans: ["'Outfit'", "'Inter'", '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
