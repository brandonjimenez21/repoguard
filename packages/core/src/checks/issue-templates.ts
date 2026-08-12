import path from 'node:path';
import type { Check } from '../types.js';
import { listDirIfExists, pathExists } from './util.js';

export const issueTemplatesCheck: Check = {
  id: 'issue-templates',
  title: 'Issue templates',
  category: 'governance',
  weight: 7,
  async run(repoPath) {
    const dir = path.join(repoPath, '.github', 'ISSUE_TEMPLATE');
    const files = await listDirIfExists(dir);
    if (files.length > 0) {
      return { severity: 'pass', message: `${files.length} issue template(s) in .github/ISSUE_TEMPLATE.` };
    }

    const legacy = await pathExists(path.join(repoPath, '.github', 'issue_template.md'));
    if (legacy) {
      return { severity: 'pass', message: '.github/issue_template.md present.' };
    }

    return {
      severity: 'warn',
      message: 'No issue templates — bug reports and feature requests arrive unstructured.',
    };
  },
};
