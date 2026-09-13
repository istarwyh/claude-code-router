import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/styles/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
          ink: 'var(--color-primary-ink)',
          light: 'var(--color-primary-light)',
          foreground: 'var(--color-primary-foreground)',
          'dark-foreground': 'var(--color-primary-dark-foreground)',
          'light-foreground': 'var(--color-primary-light-foreground)',
        },
        accent: 'var(--color-accent)',
        'accent-foreground': 'var(--color-accent-foreground)',

        // Feedback colors
        success: 'var(--color-success)',
        'success-foreground': 'var(--color-success-foreground)',
        warning: 'var(--color-warning)',
        'warning-foreground': 'var(--color-warning-foreground)',
        error: 'var(--color-error)',
        'error-foreground': 'var(--color-error-foreground)',

        // Teal scale
        teal: {
          400: 'var(--color-teal-400)',
          500: 'var(--color-teal-500)',
          600: 'var(--color-teal-600)',
          '400-foreground': 'var(--color-teal-400-foreground)',
          '500-foreground': 'var(--color-teal-500-foreground)',
          '600-foreground': 'var(--color-teal-600-foreground)',
        },

        // Background colors
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-tertiary': 'var(--color-bg-tertiary)',
        'bg-accent': 'var(--color-bg-accent)',
        'bg-warm': 'var(--color-bg-warm)',

        // Floating glass colors
        floating: {
          surface: 'var(--color-surface-floating)',
          'surface-strong': 'var(--color-surface-floating-strong)',
          border: 'var(--color-border-floating)',
        },

        // Text colors
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'text-inverse': 'var(--color-text-inverse)',

        // Border colors
        'border-light': 'var(--color-border-light)',
        'border-medium': 'var(--color-border-medium)',
        'border-dark': 'var(--color-border-dark)',

        // Best Practices page colors
        'practices-accent': 'var(--color-practices-accent)',
        'practices-primary': 'var(--color-practices-primary)',
        'practices-secondary': 'var(--color-practices-secondary)',
      },
      borderRadius: {
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        floating: 'var(--shadow-floating)',
        'floating-strong': 'var(--shadow-floating-strong)',
        'primary-glow': 'var(--shadow-primary-glow)',
      },
      backdropBlur: {
        floating: 'var(--blur-floating)',
      },
      translate: {
        lift: 'var(--motion-hover-lift)',
      },
      scale: {
        press: 'var(--motion-press-scale)',
      },
    },
  },
  plugins: [],
};

export default config;
