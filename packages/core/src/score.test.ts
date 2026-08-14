import { describe, expect, it } from 'vitest';
import { gradeFor, pointsFor, totalScore } from './score.js';
import type { CheckResult } from './types.js';

describe('pointsFor', () => {
  it('gives full weight for pass, half for warn, zero for fail', () => {
    expect(pointsFor('pass', 10)).toBe(10);
    expect(pointsFor('warn', 10)).toBe(5);
    expect(pointsFor('fail', 10)).toBe(0);
  });
});

describe('totalScore', () => {
  it('sums weighted results into a percentage', () => {
    const results: CheckResult[] = [
      { id: 'a', title: 'A', category: 'ci', severity: 'pass', message: '', weight: 60 },
      { id: 'b', title: 'B', category: 'docs', severity: 'fail', message: '', weight: 40 },
    ];
    const { score, maxScore, percentage } = totalScore(results);
    expect(maxScore).toBe(100);
    expect(score).toBe(60);
    expect(percentage).toBe(60);
  });

  it('returns 0 percentage for an empty result set', () => {
    expect(totalScore([]).percentage).toBe(0);
  });
});

describe('gradeFor', () => {
  it.each([
    [95, 'A'],
    [80, 'B'],
    [65, 'C'],
    [45, 'D'],
    [10, 'F'],
  ] as const)('%i%% -> %s', (percentage, expected) => {
    expect(gradeFor(percentage)).toBe(expected);
  });
});
