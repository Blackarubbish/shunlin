/** @type {import('tailwindcss').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {
      content: ['{routes,islands,components}/**/*.{ts,tsx,js,jsx}'],
      theme: {
        extend: {
          colors: {
            primary: {
              DEFAULT: 'var(--primary-color)',
              dark: 'var(--primary-dark)',
              light: 'var(--primary-light)'
            },
            secondary: 'var(--secondary-color)',
            background: {
              DEFAULT: 'var(--bg-color)',
              alt: 'var(--bg-alt)',
              card: 'var(--card-bg)',
              input: 'var(--input-bg)'
            },
            text: {
              DEFAULT: 'var(--text-color)',
              primary: 'var(--text-primary)',
              secondary: 'var(--text-secondary)',
              tertiary: 'var(--text-tertiary)',
              hover: 'var(--text-hover-color)'
            },
            border: 'var(--border-color)',
            footer: {
              bg: 'var(--footer-bg)',
              text: 'var(--footer-text)'
            }
          },
          boxShadow: {
            card: 'var(--card-shadow)',
            'card-hover': 'var(--card-hover-shadow)'
          },
          transitionTimingFunction: {
            theme: 'var(--transition-curve)'
          },
          animation: {
            pulse: 'pulse 2s infinite',
            float: 'float 6s ease-in-out infinite',
            bounce: 'bounce 2s ease-in-out infinite'
          },
          keyframes: {
            float: {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-20px)' }
            },
            bounce: {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-10px)' }
            }
          }
        }
      }
    }
  }
};

export default config;
