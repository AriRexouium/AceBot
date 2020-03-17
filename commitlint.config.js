module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['CI', 'Docs', 'Feature', 'Fix', 'Improvement', 'Revise']],
    'type-case': [2, 'always', 'start-case'],
    'subject-case': [2, 'always', ['sentence-case']],
    'subject-full-stop': [2, 'always', '.']
  }
}
