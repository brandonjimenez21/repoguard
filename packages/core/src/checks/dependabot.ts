import path from 'node:path';
import { parse } from 'yaml';
import type { Check } from '../types.js';
import { findFirstExisting, readFileIfExists } from './util.js';

interface DependabotConfig {
  updates?: Array<{ 'package-ecosystem'?: string }>;
}

export const dependabotCheck: Check = {
  id: 'dependabot',
  title: 'Automated dependency updates (Dependabot)',
  category: 'security',
  weight: 15,
  helpUrl: 'https://docs.github.com/code-security/dependabot',
  async run(repoPath) {
    const found = await findFirstExisting(repoPath, [
      '.github/dependabot.yml',
      '.github/dependabot.yaml',
    ]);

    if (!found) {
      return {
        severity: 'fail',
        message: 'No .github/dependabot.yml — dependency updates and CVEs must be tracked by hand.',
      };
    }

    const raw = await readFileIfExists(path.join(repoPath, found));
    let ecosystems: string[] = [];
    try {
      const parsed = parse(raw ?? '') as DependabotConfig | null;
      ecosystems =
        parsed?.updates?.map((u) => u['package-ecosystem']).filter((v): v is string => !!v) ?? [];
    } catch {
      return { severity: 'warn', message: `${found} exists but could not be parsed as YAML.` };
    }

    if (ecosystems.length === 0) {
      return { severity: 'warn', message: `${found} exists but declares no "updates" entries.` };
    }

    return {
      severity: 'pass',
      message: `Dependabot watching: ${ecosystems.join(', ')}.`,
    };
  },
};
