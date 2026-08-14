import { describe, expect, it } from 'vitest';
import { makeTempRepo } from '../test-helpers.js';
import { dependabotCheck } from './dependabot.js';

describe('dependabotCheck', () => {
  it('fails when config is missing', async () => {
    const repo = await makeTempRepo({});
    const result = await dependabotCheck.run(repo);
    expect(result.severity).toBe('fail');
  });

  it('warns when config has no updates entries', async () => {
    const repo = await makeTempRepo({ '.github/dependabot.yml': 'version: 2\n' });
    const result = await dependabotCheck.run(repo);
    expect(result.severity).toBe('warn');
  });

  it('passes and lists ecosystems when updates are declared', async () => {
    const repo = await makeTempRepo({
      '.github/dependabot.yml': [
        'version: 2',
        'updates:',
        '  - package-ecosystem: "npm"',
        '    directory: "/"',
        '    schedule:',
        '      interval: "weekly"',
        '  - package-ecosystem: "github-actions"',
        '    directory: "/"',
        '    schedule:',
        '      interval: "weekly"',
        '',
      ].join('\n'),
    });
    const result = await dependabotCheck.run(repo);
    expect(result.severity).toBe('pass');
    expect(result.message).toContain('npm');
    expect(result.message).toContain('github-actions');
  });
});
