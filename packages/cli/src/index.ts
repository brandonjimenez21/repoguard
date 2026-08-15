#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import { Command } from 'commander';
import { auditRepo } from '@repoguard/core';
import { renderJson, renderMarkdown, renderTable } from './render.js';

const program = new Command();

program
  .name('repoguard')
  .description('Audit a repository for engineering best practices and print a health score.')
  .version('0.1.0');

program
  .command('audit', { isDefault: true })
  .description('Run the audit against a repository path')
  .option('-p, --path <dir>', 'path to the repository to audit', '.')
  .option('-f, --format <format>', 'output format: table | json | md', 'table')
  .option('-o, --out <file>', 'write output to a file instead of stdout')
  .option('--min-score <percentage>', 'exit with code 1 if the score falls below this percentage', '0')
  .action(async (opts: { path: string; format: string; out?: string; minScore: string }) => {
    const report = await auditRepo(opts.path);

    let output: string;
    switch (opts.format) {
      case 'json':
        output = renderJson(report);
        break;
      case 'md':
      case 'markdown':
        output = renderMarkdown(report);
        break;
      case 'table':
        output = renderTable(report);
        break;
      default:
        console.error(`Unknown format "${opts.format}". Use table, json, or md.`);
        process.exit(2);
    }

    if (opts.out) {
      await fs.writeFile(opts.out, output, 'utf8');
    } else {
      console.log(output);
    }

    const minScore = Number(opts.minScore);
    if (!Number.isNaN(minScore) && report.percentage < minScore) {
      console.error(`\nScore ${report.percentage}% is below the required minimum of ${minScore}%.`);
      process.exit(1);
    }
  });

program.parseAsync(process.argv);
