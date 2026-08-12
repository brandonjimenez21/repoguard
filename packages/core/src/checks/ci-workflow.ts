import path from 'node:path';
import type { Check } from '../types.js';
import { listDirIfExists, readFileIfExists } from './util.js';

const WORKFLOW_EXT = /\.ya?ml$/i;

export const ciWorkflowCheck: Check = {
  id: 'ci-workflow',
  title: 'Continuous Integration (GitHub Actions)',
  category: 'ci',
  weight: 20,
  helpUrl: 'https://docs.github.com/actions',
  async run(repoPath) {
    const workflowsDir = path.join(repoPath, '.github', 'workflows');
    const files = (await listDirIfExists(workflowsDir)).filter((f) => WORKFLOW_EXT.test(f));

    if (files.length === 0) {
      return {
        severity: 'fail',
        message: 'No workflows found in .github/workflows — nothing runs tests automatically on push or PR.',
      };
    }

    let hasPushOrPrTrigger = false;
    for (const file of files) {
      const contents = await readFileIfExists(path.join(workflowsDir, file));
      if (!contents) continue;
      if (/^\s*on:/m.test(contents) && /(push|pull_request)/.test(contents)) {
        hasPushOrPrTrigger = true;
        break;
      }
    }

    if (!hasPushOrPrTrigger) {
      return {
        severity: 'warn',
        message: `Found ${files.length} workflow file(s), but none trigger on push/pull_request — CI may not run when it matters.`,
      };
    }

    return {
      severity: 'pass',
      message: `${files.length} workflow(s) configured, triggered on push/pull_request.`,
    };
  },
};
