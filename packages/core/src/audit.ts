import path from 'node:path';
import { allChecks } from './checks/index.js';
import { gradeFor, totalScore } from './score.js';
import type { AuditReport, Check, CheckResult } from './types.js';

export interface AuditOptions {
  /** run only these check ids; defaults to every registered check */
  checks?: Check[];
}

export async function auditRepo(repoPath: string, options: AuditOptions = {}): Promise<AuditReport> {
  const checks = options.checks ?? allChecks;
  const resolvedPath = path.resolve(repoPath);

  const results: CheckResult[] = await Promise.all(
    checks.map(async (check) => {
      const outcome = await check.run(resolvedPath);
      return {
        id: check.id,
        title: check.title,
        category: check.category,
        weight: check.weight,
        helpUrl: check.helpUrl,
        ...outcome,
      };
    }),
  );

  const { score, maxScore, percentage } = totalScore(results);

  return {
    repoPath: resolvedPath,
    generatedAt: new Date().toISOString(),
    results,
    score,
    maxScore,
    percentage,
    grade: gradeFor(percentage),
  };
}
