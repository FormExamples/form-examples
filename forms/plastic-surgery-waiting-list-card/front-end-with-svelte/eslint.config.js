import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';

export default ts.config(
  { ignores: ['.svelte-kit/', '.claude/', 'build/', 'node_modules/', 'package/'] },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  prettier,
  ...svelte.configs.prettier,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } }
  },
  {
    // `_`-prefixed names mark deliberately unused parameters and bindings.
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ]
    }
  },
  {
    // Links are root-absolute (`/<slug>/…`) and no `kit.paths.base` is configured, so
    // `resolve()` would add churn without changing any URL.
    rules: { 'svelte/no-navigation-without-resolve': 'off' }
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
    languageOptions: { parserOptions: { parser: ts.parser } }
  }
);
