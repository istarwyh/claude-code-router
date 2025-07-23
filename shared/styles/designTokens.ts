export const designTokens = `
:root {
    /* Design Tokens - Colors */
    --color-primary: #2563eb;
    --color-primary-dark: #1d4ed8;
    --color-primary-light: #3b82f6;
    --color-secondary: #7c3aed;
    --color-accent: #06b6d4;
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-error: #ef4444;
    
    /* Text Colors */
    --color-text-primary: #0f172a;
    --color-text-secondary: #475569;
    --color-text-muted: #64748b;
    --color-text-inverse: #ffffff;
    
    /* Background Colors */
    --color-bg-primary: #ffffff;
    --color-bg-secondary: #f8fafc;
    --color-bg-tertiary: #f1f5f9;
    --color-bg-accent: #eff6ff;
    
    /* Border Colors */
    --color-border-light: #e2e8f0;
    --color-border-medium: #cbd5e1;
    --color-border-dark: #94a3b8;
    
    /* Best Practices Page Specific Colors - BEM命名规范 */
    --color-practices-page-bg: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    --color-practices-text-primary: #0f172a;
    --color-practices-text-secondary: #475569;
    --color-practices-bg-primary: #ffffff;
    --color-practices-bg-secondary: #f8fafc;
    --color-practices-bg-hover: #f1f5f9;
    --color-practices-border-color: #e2e8f0;
    --color-practices-border-hover: #cbd5e1;
    --color-practices-accent: #06b6d4;
    --color-practices-primary: #2563eb;
    --color-practices-secondary: #6366f1;
    
    /* 简化的CSS变量别名，用于最佳实践卡片 */
    --bp-bg-primary: var(--color-practices-bg-primary);
    --bp-bg-secondary: var(--color-practices-bg-secondary);
    --bp-text-primary: var(--color-practices-text-primary);
    --bp-text-secondary: var(--color-practices-text-secondary);
    --bp-border-color: var(--color-practices-border-color);
    --bp-border-hover: var(--color-practices-border-hover);
    --bp-accent: var(--color-practices-accent);
    --bp-primary: var(--color-practices-primary);
    --bp-primary-dark: var(--color-primary-dark);
    --bp-secondary: var(--color-practices-secondary);
    
    /* Typography */
    --font-family-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    --font-family-mono: 'JetBrains Mono', 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace;
    
    /* Font Sizes */
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;
    --font-size-4xl: 2.25rem;
    
    /* Spacing */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.25rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --space-10: 2.5rem;
    --space-12: 3rem;
    --space-16: 4rem;
    --space-20: 5rem;
    
    /* Border Radius */
    --radius-sm: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --radius-3xl: 1.5rem;
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    
    /* Transitions */
    --transition-fast: 0.15s ease-out;
    --transition-normal: 0.2s ease-out;
    --transition-slow: 0.3s ease-out;
}
`;
