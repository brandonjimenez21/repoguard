export type Severity = 'pass' | 'warn' | 'fail';

export type Category =
  | 'ci'
  | 'security'
  | 'governance'
  | 'release'
  | 'docs';

export interface CheckResult {
  /** stable machine id, e.g. "ci-workflow" */
  id: string;
  title: string;
  category: Category;
  severity: Severity;
  message: string;
  /** how many points this check contributes when it fully passes */
  weight: number;
  /** link to the section of the guide that explains this practice */
  helpUrl?: string;
}

export interface Check {
  id: string;
  title: string;
  category: Category;
  weight: number;
  helpUrl?: string;
  run(repoPath: string): Promise<Pick<CheckResult, 'severity' | 'message'>>;
}

export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface AuditReport {
  repoPath: string;
  generatedAt: string;
  results: CheckResult[];
  score: number;
  maxScore: number;
  percentage: number;
  grade: Grade;
}
