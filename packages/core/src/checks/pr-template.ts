import type { Check } from '../types.js';
import { findFirstExisting } from './util.js';

export const prTemplateCheck: Check = {
  id: 'pr-template',
  title: 'Pull request template',
  category: 'governance',
  weight: 8,
  async run(repoPath) {
    const found = await findFirstExisting(repoPath, [
      '.github/PULL_REQUEST_TEMPLATE.md',
      '.github/pull_request_template.md',
      'PULL_REQUEST_TEMPLATE.md',
      'docs/pull_request_template.md',
    ]);
    if (!found) {
      return {
        severity: 'warn',
        message: 'No PR template — reviewers get inconsistent context on every pull request.',
      };
    }
    return { severity: 'pass', message: `${found} present.` };
  },
};
