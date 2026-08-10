import type { CheckResult, Grade, Severity } from './types.js';

/** pass = full weight, warn = half credit, fail = no credit */
export function pointsFor(severity: Severity, weight: number): number {
  switch (severity) {
    case 'pass':
      return weight;
    case 'warn':
      return weight / 2;
    case 'fail':
      return 0;
  }
}

export function totalScore(results: CheckResult[]): { score: number; maxScore: number; percentage: number } {
  const maxScore = results.reduce((sum, r) => sum + r.weight, 0);
  const score = results.reduce((sum, r) => sum + pointsFor(r.severity, r.weight), 0);
  const percentage = maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);
  return { score: Math.round(score * 100) / 100, maxScore, percentage };
}

export function gradeFor(percentage: number): Grade {
  if (percentage >= 90) return 'A';
  if (percentage >= 75) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
}
