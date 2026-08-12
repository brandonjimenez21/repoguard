import path from 'node:path';
import type { Check } from '../types.js';
import { findFirstExisting, readFileIfExists } from './util.js';

export const codeownersCheck: Check = {
  id: 'codeowners',
  title: 'Review routing (CODEOWNERS)',
  category: 'governance',
  weight: 10,
  helpUrl: 'https://docs.github.com/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners',
  async run(repoPath) {
    const found = await findFirstExisting(repoPath, [
      '.github/CODEOWNERS',
      'CODEOWNERS',
      'docs/CODEOWNERS',
    ]);

    if (!found) {
      return {
        severity: 'fail',
        message: 'No CODEOWNERS file — PRs are not automatically routed to the right reviewer.',
      };
    }

    const raw = (await readFileIfExists(path.join(repoPath, found))) ?? '';
    const rules = raw
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'));

    if (rules.length === 0) {
      return { severity: 'warn', message: `${found} exists but has no ownership rules defined.` };
    }

    return { severity: 'pass', message: `${found} defines ${rules.length} ownership rule(s).` };
  },
};
