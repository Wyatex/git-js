import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: {
    prettierOptions: {
      semi: false,
      singleQuote: true,
      trailingComma: 'es5',
      arrowParens: 'avoid',
    },
  },
  ignores: [
    // ignore paths
  ],
  rules: {
    // rule overrides
    'no-console': 'off',
  },
  markdown: {
    rules: {
      // markdown rule overrides
    },
  },
})
