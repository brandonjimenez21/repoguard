import path from 'node:path';
import type { Check } from '../types.js';
import { listDirIfExists, readFileIfExists } from './util.js';

export const codeqlCheck: Check = {
  id: 'codeql',
  title: 'Code scanning (CodeQL)',
  category: 'security',
  weight: 15,
  helpUrl: 'https://docs.github.com/code-security/code-scanning',
  async run(repoPath) {
    const workflowsDir = path.join(repoPath, '.github', 'workflows');
    const files = await listDirIfExists(workflowsDir);

    for (const file of files) {
      const contents = await readFileIfExists(path.join(workflowsDir, file));
      if (contents && /github\/codeql-action\/(init|analyze)/.test(contents)) {
        return {
          severity: 'pass',
          message: `CodeQL analysis configured in .github/workflows/${file}.`,
        };
      }
    }

    return {
      severity: 'fail',
      message:
        'No CodeQL workflow found. Enable "Code scanning" under the Security tab, or add github/codeql-action.',
    };
  },
};
