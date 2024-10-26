import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['dist'],

    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: typescriptParser,
      parserOptions: {
        project: ['./tsconfig.node.json', './client/tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },

    settings: {
      react: { version: '18.3' },
    },

    plugins: {
      '@typescript-eslint': typescriptEslint,
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
    },

    rules: {
      // TypeScript Recommended Rules
      ...typescriptEslint.configs.recommended.rules,
      ...typescriptEslint.configs['recommended-type-checked'].rules,
      ...typescriptEslint.configs['stylistic-type-checked'].rules,

      // React Rules
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,

      // React Hooks Rules
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Prettier Formatting Rule
      'prettier/prettier': ['error'],
    },
  },
];
