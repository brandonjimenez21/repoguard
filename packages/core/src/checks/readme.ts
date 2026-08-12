import path from 'node:path';
import type { Check } from '../types.js';
import { readFileIfExists } from './util.js';

const MIN_LENGTH = 200;

export const readmeCheck: Check = {
  id: 'readme',
  title: 'README quality',
  category: 'docs',
  weight: 10,
  async run(repoPath) {
    const contents = await readFileIfExists(path.join(repoPath, 'README.md'));

    if (!contents) {
      return { severity: 'fail', message: 'No README.md — nobody arriving at the repo knows what it does.' };
    }

    if (contents.trim().length < MIN_LENGTH) {
      return {
        severity: 'warn',
        message: `README.md exists but is very short (${contents.trim().length} chars) — likely just a title.`,
      };
    }

    const hasHeading = /^#{1,2}\s+.+/m.test(contents);
    if (!hasHeading) {
      return { severity: 'warn', message: 'README.md has content but no clear sections (headings).' };
    }

    return { severity: 'pass', message: `README.md is ${contents.trim().length} characters with structured sections.` };
  },
};
