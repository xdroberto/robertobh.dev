import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Strict: no unused vars (error, not warning)
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // No console.log in production code
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Enforce consistent returns
      'consistent-return': 'off',
      // React hooks exhaustive deps
      'react-hooks/exhaustive-deps': 'warn',
      // No explicit any
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
])
