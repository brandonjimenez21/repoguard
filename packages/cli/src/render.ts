import chalk from 'chalk';
import Table from 'cli-table3';
import type { AuditReport, Severity } from '@repoguard/core';

const SEVERITY_ICON: Record<Severity, string> = {
  pass: '✔',
  warn: '!',
  fail: '✘',
};

function colorFor(severity: Severity): (text: string) => string {
  if (severity === 'pass') return chalk.green;
  if (severity === 'warn') return chalk.yellow;
  return chalk.red;
}

export function renderTable(report: AuditReport): string {
  const table = new Table({
    head: ['', 'Check', 'Category', 'Weight', 'Detail'],
    wordWrap: true,
    colWidths: [3, 28, 12, 8, 55],
  });

  for (const result of report.results) {
    const color = colorFor(result.severity);
    table.push([
      color(SEVERITY_ICON[result.severity]),
      result.title,
      result.category,
      String(result.weight),
      result.message,
    ]);
  }

  const gradeColor = report.grade === 'A' || report.grade === 'B' ? chalk.green : report.grade === 'C' ? chalk.yellow : chalk.red;

  return [
    table.toString(),
    '',
    `Score: ${report.score}/${report.maxScore} (${report.percentage}%)  Grade: ${gradeColor(report.grade)}`,
  ].join('\n');
}

export function renderJson(report: AuditReport): string {
  return JSON.stringify(report, null, 2);
}

export function renderMarkdown(report: AuditReport): string {
  const lines: string[] = [];
  lines.push(`## RepoGuard report — grade ${report.grade} (${report.percentage}%)`);
  lines.push('');
  lines.push(`Score: **${report.score}/${report.maxScore}** · generated ${report.generatedAt}`);
  lines.push('');
  lines.push('| | Check | Category | Weight | Detail |');
  lines.push('|---|---|---|---|---|');
  for (const result of report.results) {
    const icon = result.severity === 'pass' ? '✅' : result.severity === 'warn' ? '⚠️' : '❌';
    lines.push(
      `| ${icon} | ${result.title} | ${result.category} | ${result.weight} | ${result.message.replace(/\|/g, '\\|')} |`,
    );
  }
  return lines.join('\n');
}
