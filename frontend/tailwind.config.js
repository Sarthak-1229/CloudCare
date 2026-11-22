/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#1C1917',
          hover: '#292524',
          light: '#2A2624',
          surface: '#151412',
        },
        ink: {
          DEFAULT: '#18181B',
          secondary: '#6E6A63',
          muted: '#9C968E',
        },
        porcelain: {
          DEFAULT: '#F9F8F6',
          ambient: '#EFECE6',
        },
        stone: {
          50: '#F9F8F6',
          100: '#F3F1ED',
          200: '#ECE9E2',
          300: '#DCD7CE',
          400: '#9C968E',
          500: '#6E6A63',
          900: '#18181B',
        },
        copper: {
          DEFAULT: '#C85A32',
          hover: '#B34E2A',
          light: '#FBF4EE',
          border: '#F3DEC7',
        },
        emerald: {
          DEFAULT: '#10B981',
          light: '#ECFDF5',
          border: '#A7F3D0',
        },
      },
      borderRadius: {
        'squircle': '14px',
        'card': '24px',
      },
      boxShadow: {
        'luxury': '0 1px 2px rgba(0,0,0,0.03), 0 24px 48px -12px rgba(28, 25, 23, 0.06)',
        'subtle': '0 1px 3px rgba(28, 25, 23, 0.04), 0 1px 2px rgba(28, 25, 23, 0.02)',
        'dropdown': '0 4px 20px -2px rgba(28, 25, 23, 0.08)',
        'obsidian': '0 8px 20px -4px rgba(28, 25, 23, 0.20)',
        'copper': '0 8px 20px -4px rgba(200, 90, 50, 0.20)',
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
}
