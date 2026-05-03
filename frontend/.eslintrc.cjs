/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2024: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: { version: 'detect' },
  },
  plugins: ['react', 'react-refresh'],
  rules: {
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
};
