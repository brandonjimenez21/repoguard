import { describe, expect, it } from 'vitest';
import { auditRepo } from './audit.js';
import { makeTempRepo } from './test-helpers.js';
import type { Check } from './types.js';

describe('auditRepo', () => {
  it('runs every registered check and aggregates a report', async () => {
    const repo = await makeTempRepo({ 'README.md': 'x'.repeat(300) + '\n\n## Usage\n' });
    const report = await auditRepo(repo);

    expect(report.results.length).toBeGreaterThan(0);
    expect(report.results.map((r) => r.id)).toContain('readme');
    expect(report.maxScore).toBe(report.results.reduce((s, r) => s + r.weight, 0));
    expect(['A', 'B', 'C', 'D', 'F']).toContain(report.grade);
  });

  it('accepts a custom subset of checks', async () => {
    const repo = await makeTempRepo({});
    const onlyCheck: Check = {
      id: 'always-pass',
      title: 'Always passes',
      category: 'docs',
      weight: 10,
      async run() {
        return { severity: 'pass', message: 'ok' };
      },
    };

    const report = await auditRepo(repo, { checks: [onlyCheck] });
    expect(report.results).toHaveLength(1);
    expect(report.percentage).toBe(100);
    expect(report.grade).toBe('A');
  });
});
