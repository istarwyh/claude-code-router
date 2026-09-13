import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import security from 'eslint-plugin-security';

export default [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.open-next/**',
      '.wrangler/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '.cache/**',
      'src/scripts/generated/**',
      '**/*.min.js',
      '**/*.min.css',
      '**/*Bundle.ts',
      '**/bundle-*/**',
      'scripts/*.cjs',
      'fix-eslint-issues.js',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.wrangler/**',
      'src/scripts/generated/**',
      '**/*.min.js',
      '**/*.min.css',
      'coverage/**',
      '.cache/**',
      '**/*Bundle.ts',
      '**/bundle-*/**',
      'scripts/*.cjs',
      'fix-eslint-issues.js',
    ],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // Node.js globals
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',

        // Web APIs
        fetch: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        Headers: 'readonly',
        AbortController: 'readonly',
        AbortSignal: 'readonly',
        DOMException: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        crypto: 'readonly',
        TextEncoder: 'readonly',
        TextDecoder: 'readonly',
        ReadableStream: 'readonly',
        btoa: 'readonly',
        atob: 'readonly',

        // Browser DOM APIs
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        HTMLElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLCanvasElement: 'readonly',
        Event: 'readonly',
        KeyboardEvent: 'readonly',
        MouseEvent: 'readonly',
        Image: 'readonly',
        Blob: 'readonly',
        ClipboardItem: 'readonly',
        CanvasRenderingContext2D: 'readonly',
        MutationObserver: 'readonly',
        history: 'readonly',
        ReadableStreamDefaultController: 'readonly',

        // Cloudflare Workers
        addEventListener: 'readonly',
        removeEventListener: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',

        // Types that might be used
        RequestInit: 'readonly',
        ExportedHandler: 'readonly',
        ExportedHandlerFetchHandler: 'readonly',
        ScheduledController: 'readonly',
        IncomingRequestCfProperties: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier,
      security: security,
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',

      // Security rules
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',

      // General rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': 'off',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'no-empty': 'warn',
      'no-undef': 'error',

      // Prettier integration
      'prettier/prettier': 'error',
    },
  },
  {
    // More lenient rules for client-side code where type safety is harder to enforce
    files: ['src/client/**/*.ts', 'src/client/**/*.tsx', 'src/components-next/**/*.ts', 'src/components-next/**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'security/detect-object-injection': 'off',
      'no-undef': 'warn', // Many browser APIs may not be fully typed
    },
  },
  {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
];
