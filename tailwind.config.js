/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom palette
        accent: {
          DEFAULT: '#00ff41',
          hover: '#00cc33',
          glow: 'rgba(0,255,65,0.15)',
        },
        bg: {
          primary: {
            light: '#ffffff',
            dark: '#0a0a0a',
          },
          secondary: {
            light: '#f9fafb',
            dark: '#111111',
          },
          tertiary: {
            light: '#f3f4f6',
            dark: '#1a1a1a',
          },
        },
        text: {
          primary: {
            light: '#111111',
            dark: '#fafafa',
          },
          secondary: {
            light: '#6b7280',
            dark: '#a1a1a1',
          },
          muted: {
            light: '#9ca3af',
            dark: '#737373',
          },
        },
        border: {
          DEFAULT: '#e5e7eb',
          dark: '#262626',
          hover: {
            light: '#d1d5db',
            dark: '#404040',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'accent': '0 0 20px rgba(0,255,65,0.15)',
        'accent-lg': '0 0 30px rgba(0,255,65,0.25)',
      },
    },
  },
  plugins: [],
}
