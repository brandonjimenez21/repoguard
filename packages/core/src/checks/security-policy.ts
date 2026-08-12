import type { Check } from '../types.js';
import { findFirstExisting } from './util.js';

export const securityPolicyCheck: Check = {
  id: 'security-policy',
  title: 'Security policy (SECURITY.md)',
  category: 'security',
  weight: 5,
  async run(repoPath) {
    const found = await findFirstExisting(repoPath, ['SECURITY.md', '.github/SECURITY.md']);
    if (!found) {
      return {
        severity: 'warn',
        message: 'No SECURITY.md — no documented way for someone to privately report a vulnerability.',
      };
    }
    return { severity: 'pass', message: `${found} present.` };
  },
};
