module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
    'eslint-config-prettier',
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  parserOptions: {
    project: './tsconfig.json'
  },
  ignorePatterns: ['.eslintrc.cjs', 'vite.config.ts'],
};
