import type { Check } from '../types.js';
import { ciWorkflowCheck } from './ci-workflow.js';
import { codeqlCheck } from './codeql.js';
import { codeownersCheck } from './codeowners.js';
import { dependabotCheck } from './dependabot.js';
import { issueTemplatesCheck } from './issue-templates.js';
import { licenseCheck } from './license.js';
import { prTemplateCheck } from './pr-template.js';
import { readmeCheck } from './readme.js';
import { securityPolicyCheck } from './security-policy.js';

/**
 * All checks that run purely against the local filesystem — no GitHub token
 * required. Checks that need repo settings (branch protection, merge queue,
 * security-feature toggles, releases) live behind `--token` — see ROADMAP.md.
 */
export const allChecks: Check[] = [
  ciWorkflowCheck,
  codeqlCheck,
  dependabotCheck,
  codeownersCheck,
  licenseCheck,
  securityPolicyCheck,
  prTemplateCheck,
  issueTemplatesCheck,
  readmeCheck,
];
