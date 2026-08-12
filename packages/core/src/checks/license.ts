import type { Check } from '../types.js';
import { findFirstExisting } from './util.js';

export const licenseCheck: Check = {
  id: 'license',
  title: 'License',
  category: 'governance',
  weight: 10,
  async run(repoPath) {
    const found = await findFirstExisting(repoPath, ['LICENSE', 'LICENSE.md', 'LICENSE.txt']);
    if (!found) {
      return {
        severity: 'fail',
        message: 'No LICENSE file — legally unclear whether the code can be reused at all.',
      };
    }
    return { severity: 'pass', message: `${found} present.` };
  },
};
