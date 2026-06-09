import { defineConfig, globalIgnores, } from 'eslint/config';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import js from '@eslint/js';
import { FlatCompat, } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  globalIgnores(['./dist']),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      'ecmaVersion': 'latest',
      'sourceType': 'module',
      parserOptions: {},
    },

    extends: compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'),

    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    'rules': {
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      '@typescript-eslint/no-empty-object-type': 'off'
    },
  }, {
    languageOptions: {
      globals: {
        ...globals.node,
      },

      'sourceType': 'script',
      parserOptions: {},
    },

    files: ['**/.eslintrc.{js,cjs}'],
  }]);
