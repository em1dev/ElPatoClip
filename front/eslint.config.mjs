import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import { fixupConfigRules, } from '@eslint/compat';
import tsParser from '@typescript-eslint/parser';
import reactRefresh from 'eslint-plugin-react-refresh';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
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

export default defineConfig([{
  languageOptions: {
    globals: {
      ...globals.browser,
    },

    parser: tsParser,
  },

  extends: fixupConfigRules(compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended',
  )),

  plugins: {
    'react-refresh': reactRefresh,
  },

  rules: {
    'react-refresh/only-export-components': ['warn', {
      allowConstantExport: true,
    }],

    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-unused-expressions': 'off'
  },
}, globalIgnores(['**/dist', '**/.eslintrc.cjs'])]);
