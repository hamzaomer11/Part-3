import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  rules: {
    '@stylistic/js/indent': [
      'error',
      2,
    ],
    '@stylistic/js/linebreak-style': [
      'error',
      'unix',
    ],
    '@stylistic/js/quotes': [
      'error',
      'single',
    ],
    '@stylistic/js/semi': [
      'error',
      'never',
    ],
    eqeqeq: 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'error', 'always',
    ],
    'arrow-spacing': [
      'error', { before: true, after: true },
    ],
    'no-console': 'off',
  },
});
