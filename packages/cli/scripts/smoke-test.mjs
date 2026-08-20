#!/usr/bin/env node
// Runs the built CLI end-to-end so a dependency that's fine at the type
// level but broken at runtime (see ROADMAP.md) fails CI instead of shipping.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.resolve(__dirname, '../dist/index.js');
const repoRoot = path.resolve(__dirname, '../../..');

let failures = 0;

function check(label, fn) {
  try {
    fn();
    console.log(`  ok - ${label}`);
  } catch (err) {
    failures += 1;
    console.error(`  FAIL - ${label}`);
    console.error(`    ${err.message}`);
  }
}

function run(args) {
  return spawnSync(process.execPath, [cliPath, ...args], { encoding: 'utf8' });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

console.log(`Smoke-testing ${cliPath} against ${repoRoot}\n`);

check('audit --format json exits 0 and prints a well-formed report', () => {
  const result = run(['audit', '--path', repoRoot, '--format', 'json']);
  assert(result.status === 0, `expected exit code 0, got ${result.status}\n${result.stderr}`);

  const report = JSON.parse(result.stdout);
  assert(Array.isArray(report.results) && report.results.length > 0, 'report.results should be a non-empty array');
  assert(typeof report.percentage === 'number', 'report.percentage should be a number');
  assert(['A', 'B', 'C', 'D', 'F'].includes(report.grade), `unexpected grade "${report.grade}"`);
  for (const r of report.results) {
    assert(['pass', 'warn', 'fail'].includes(r.severity), `unexpected severity "${r.severity}" for check "${r.id}"`);
  }
});

check('--min-score above the achieved score exits 1', () => {
  const result = run(['audit', '--path', repoRoot, '--format', 'json', '--min-score', '101']);
  assert(result.status === 1, `expected exit code 1, got ${result.status}`);
});

check('unknown --format exits 2', () => {
  const result = run(['audit', '--path', repoRoot, '--format', 'bogus']);
  assert(result.status === 2, `expected exit code 2, got ${result.status}`);
});

if (failures > 0) {
  console.error(`\n${failures} smoke check(s) failed`);
  process.exit(1);
}

console.log('\nAll CLI smoke checks passed');
