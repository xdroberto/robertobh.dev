import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2023,
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
      // Prefer const for never-reassigned bindings
      'prefer-const': 'error',
      // Require strict equality
      eqeqeq: 'error',
    },
  },
])
