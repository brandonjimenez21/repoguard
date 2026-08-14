import { describe, expect, it } from 'vitest';
import { makeTempRepo } from '../test-helpers.js';
import { codeownersCheck } from './codeowners.js';

describe('codeownersCheck', () => {
  it('fails when no CODEOWNERS file exists', async () => {
    const repo = await makeTempRepo({});
    const result = await codeownersCheck.run(repo);
    expect(result.severity).toBe('fail');
  });

  it('warns when the file only has comments', async () => {
    const repo = await makeTempRepo({ '.github/CODEOWNERS': '# nothing here yet\n' });
    const result = await codeownersCheck.run(repo);
    expect(result.severity).toBe('warn');
  });

  it('passes when ownership rules are declared', async () => {
    const repo = await makeTempRepo({
      '.github/CODEOWNERS': '* @someone\npackages/core/ @someone\n',
    });
    const result = await codeownersCheck.run(repo);
    expect(result.severity).toBe('pass');
  });
});
