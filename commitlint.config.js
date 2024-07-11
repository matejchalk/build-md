import { RuleConfigSeverity } from '@commitlint/types';

export default {
  extends: ['@commitlint/config-conventional'],
  plugins: ['commitlint-plugin-tense'],
  rules: {
    'tense/subject-tense': [
      RuleConfigSeverity.Error,
      'always',
      { firstOnly: true, allowedTenses: ['present-imperative'] },
    ],
  },
};
