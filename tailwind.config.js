/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#137fec',
          hover: '#0f6bc9',
        },
        accent: '#f59e0b',
        background: {
          light: '#f6f7f8',
          dark: '#101922',
        },
        card: {
          dark: '#1a2632',
        },
        border: {
          dark: '#233648',
        },
        text: {
          primary: '#ffffff',
          secondary: '#92adc9',
          dark: '#1e293b',
          muted: '#64748b',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#f43f5e',
        info: '#0ea5e9',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 25px rgba(0, 0, 0, 0.15)',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
      },
    },
  },
  plugins: [],
}
