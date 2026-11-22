/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          canvas: '#FAF7F2',
          peach: '#FDE8D7',
          sand: '#F3ECE1',
          linen: '#F5F0E6',
          border: '#E8E0D5',
          track: '#EFEAE1',
          inset: '#F7F3EB',
          input: '#F5F1E8',
          espresso: '#231F20',
          taupe: '#7A7267',
          terracotta: {
            DEFAULT: '#E06D53',
            hover: '#C85A40',
            light: '#FDF2F0',
            border: '#FAD8D2',
            coral: '#F28B66',
            dark: '#D95D43',
          },
          sage: {
            DEFAULT: '#5B8A72',
            hover: '#4D7761',
            light: '#EDF4F0',
            border: '#C4DDD0',
          },
          amber: {
            DEFAULT: '#D98A3C',
            hover: '#C0772E',
            light: '#FDF6ED',
            border: '#F5DDC0',
          },
        },
        ios: {
          bg: '#FAF7F2',
          'bg-secondary': '#FFFFFF',
          canvas: '#FAF7F2',
          blue: {
            DEFAULT: '#E06D53',
            hover: '#C85A40',
            tint: 'rgba(224, 109, 83, 0.12)',
          },
          green: {
            DEFAULT: '#5B8A72',
            tint: 'rgba(91, 138, 114, 0.12)',
          },
          orange: {
            DEFAULT: '#D98A3C',
            tint: 'rgba(217, 138, 60, 0.12)',
          },
          red: {
            DEFAULT: '#D34538',
            tint: 'rgba(211, 69, 56, 0.12)',
          },
          indigo: {
            DEFAULT: '#E06D53',
            tint: 'rgba(224, 109, 83, 0.12)',
          },
          teal: {
            DEFAULT: '#5B8A72',
            tint: 'rgba(91, 138, 114, 0.12)',
          },
          purple: {
            DEFAULT: '#8C657A',
            tint: 'rgba(140, 101, 122, 0.12)',
          },
          gray: {
            50: '#FAF7F2',
            100: '#F5F0E6',
            200: '#E8E0D5',
            300: '#D5CBC0',
            400: '#B0A79C',
            500: '#8E857B',
            600: '#7A7267',
            700: '#524B43',
            800: '#38322C',
            900: '#231F20',
          }
        }
      },
      borderRadius: {
        'ios-sm': '10px',
        'ios-md': '14px',
        'ios-lg': '18px',
        'ios-xl': '22px',
        'ios-2xl': '28px',
        'squircle': '22%',
      },
      boxShadow: {
        'ios-sm': '0 1px 3px rgba(60, 45, 30, 0.04)',
        'ios': '0 2px 10px rgba(60, 45, 30, 0.04), 0 1px 3px rgba(60, 45, 30, 0.02)',
        'ios-md': '0 4px 18px rgba(60, 45, 30, 0.06), 0 2px 6px rgba(60, 45, 30, 0.02)',
        'ios-lg': '0 12px 32px rgba(60, 45, 30, 0.08), 0 4px 12px rgba(60, 45, 30, 0.03)',
        'warm-card': '0 20px 40px -15px rgba(60, 45, 30, 0.08)',
        'terracotta': '0 8px 24px -4px rgba(224, 109, 83, 0.25)',
        'sage': '0 8px 24px -4px rgba(91, 138, 114, 0.20)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Inter"',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
