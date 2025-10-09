module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'prettier'],
  plugins: ['tailwindcss'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'tailwindcss/no-custom-classname': 'off',
  },
}
