import globals from 'globals'
import pluginJs from '@eslint/js'
import vitest from '@vitest/eslint-plugin'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  {
    files: ['**/*.test.js'],
    languageOptions: { globals: vitest.environments.env.globals },
    plugins: { vitest },
    rules: vitest.configs.all.rules
  }
]
