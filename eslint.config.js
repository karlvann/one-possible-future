// @ts-check
import nuxt from '@nuxt/eslint-config'

export default nuxt({
  features: {
    // Disable automatic stylistic rules - we'll set them manually
    stylistic: false,
    // Enable tooling support for Nuxt auto-imports
    tooling: true,
  },

  // @ts-ignore
  ignores: [
    // Build outputs
    '.nuxt/**',
    '.output/**',
    'dist/**',
    '.vercel/**',

    // Dependencies
    'node_modules/**',
    '.yarn/**',

    // Environment and cache
    '.env',
    '.env.*',
    '.cache/**',

    // Generated and static files
    '*.min.js',
    '*.bundle.js',
    'public/**',
    'static/**',
  ],

  rules: {
    // CRITICAL: Disable no-undef for Nuxt auto-imports FIRST
    'no-undef': 0,
    'no-irregular-whitespace': 'off',

    // Nuxt/Vue specific rules
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    'vue/attributes-order': 'off',
    'vue/html-self-closing': ['error', {
      'html': {
        'void': 'always',
        'normal': 'never',
        'component': 'any'
      }
    }],
    'vue/html-indent': 'off',
    'vue/max-attributes-per-line': 'off',

    // Relax stylistic rules to match existing codebase
    '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
    '@stylistic/comma-dangle': 0,
    '@stylistic/semi': ['warn', 'never'],
    '@stylistic/no-trailing-spaces': 0,
    '@stylistic/eol-last': 0,

    // Nuxt-specific relaxations
    'nuxt/prefer-import-meta': 'off',

    // General rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-unused-vars': 'off',
    'prefer-const': 'warn',
    'no-var': 'error',

    // Code quality
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'no-eval': 'error',
    'no-implied-eval': 'error',

    // Import rules
    'import/order': ['warn', {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
      ],
      'newlines-between': 'never',
    }],
  },
}, {
  // Final override config to ensure rules stay disabled
  rules: {
    'no-undef': 0,
    'vue/attributes-order': 0,
    'vue/no-v-html': 0,
    'vue/html-self-closing': 0,
    'vue/multi-word-component-names': 0,
    'vue/require-v-for-key': 0,
    'vue/valid-v-for': 0,
    'vue/no-multiple-template-root': 0,
    'no-irregular-whitespace': 0,
    'unicorn/prefer-node-protocol': 0,
    'unicorn/number-literal-case': 0,
    'nuxt/prefer-import-meta': 0,
    'no-unused-vars': 0,
    'vue/no-unused-vars': 0,
    'vue/no-unused-components': 0,
  },
})
