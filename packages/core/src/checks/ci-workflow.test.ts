import { describe, expect, it } from 'vitest';
import { makeTempRepo } from '../test-helpers.js';
import { ciWorkflowCheck } from './ci-workflow.js';

describe('ciWorkflowCheck', () => {
  it('fails when there is no workflows directory', async () => {
    const repo = await makeTempRepo({ 'README.md': '# hi' });
    const result = await ciWorkflowCheck.run(repo);
    expect(result.severity).toBe('fail');
  });

  it('warns when workflows exist but none trigger on push/pull_request', async () => {
    const repo = await makeTempRepo({
      '.github/workflows/nightly.yml': 'on:\n  schedule:\n    - cron: "0 0 * * *"\njobs: {}',
    });
    const result = await ciWorkflowCheck.run(repo);
    expect(result.severity).toBe('warn');
  });

  it('passes when a workflow triggers on push', async () => {
    const repo = await makeTempRepo({
      '.github/workflows/ci.yml': 'on:\n  push:\n  pull_request:\njobs: {}',
    });
    const result = await ciWorkflowCheck.run(repo);
    expect(result.severity).toBe('pass');
  });
});
