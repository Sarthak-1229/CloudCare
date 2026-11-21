/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          bg: '#F2F2F7',
          'bg-secondary': '#FFFFFF',
          canvas: '#F5F5F7',
          blue: {
            DEFAULT: '#007AFF',
            hover: '#0062CC',
            tint: 'rgba(0, 122, 255, 0.1)',
          },
          green: {
            DEFAULT: '#34C759',
            tint: 'rgba(52, 199, 89, 0.12)',
          },
          orange: {
            DEFAULT: '#FF9500',
            tint: 'rgba(255, 149, 0, 0.12)',
          },
          red: {
            DEFAULT: '#FF3B30',
            tint: 'rgba(255, 59, 48, 0.12)',
          },
          indigo: {
            DEFAULT: '#5856D6',
            tint: 'rgba(88, 86, 214, 0.12)',
          },
          teal: {
            DEFAULT: '#30B0C7',
            tint: 'rgba(48, 176, 199, 0.12)',
          },
          purple: {
            DEFAULT: '#AF52DE',
            tint: 'rgba(175, 82, 222, 0.12)',
          },
          gray: {
            50: '#F9F9FB',
            100: '#F2F2F7',
            200: '#E5E5EA',
            300: '#D1D1D6',
            400: '#C7C7CC',
            500: '#AEAEB2',
            600: '#8E8E93',
            700: '#636366',
            800: '#3A3A3C',
            900: '#1C1C1E',
          }
        }
      },
      borderRadius: {
        'ios-sm': '10px',
        'ios-md': '14px',
        'ios-lg': '18px',
        'ios-xl': '22px',
        'ios-2xl': '28px',
      },
      boxShadow: {
        'ios-sm': '0 1px 3px rgba(0, 0, 0, 0.04)',
        'ios': '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'ios-md': '0 4px 18px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.02)',
        'ios-lg': '0 12px 32px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03)',
        'ios-glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"SF UI Text"',
          'system-ui',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
