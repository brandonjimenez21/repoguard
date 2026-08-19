# RepoGuard

A CLI (and eventually a GitHub Action) that audits a repository against real engineering
practices — CI, security scanning, dependency updates, review routing, docs — and prints a
weighted health score.

Very early stage. See the devlog below for where this actually is.

## Devlog

- **2026-08-10** — Repo scaffolded: pnpm workspace, strict TypeScript base config, ESLint,
  Prettier, Vitest wired up. Nothing runs yet. **Next:** design the data model for a "check"
  and how scoring should work before writing any real audit logic.
- **2026-08-11** — `@repoguard/core` scaffolded: the `Check`/`CheckResult`/`AuditReport` types,
  a weighted pass/warn/fail scoring model, and small fs helpers checks will share. Still no
  actual checks. **Next:** write the first real ones — CI, CODEOWNERS, Dependabot — they're
  the ones that matter most for the score.
- **2026-08-12** — Implemented all 9 filesystem-based checks: CI workflow, CodeQL, Dependabot,
  CODEOWNERS, license, security policy, PR template, issue templates, README quality. All
  local-only, no GitHub token needed yet. **Next:** these are useless if they're wrong — cover
  every one with tests before building anything on top of them.
- **2026-08-13** — Unit tests for every check plus the scoring aggregator, using temp
  directories instead of committed fixtures (`makeTempRepo()`). 19 tests, all green. **Next:**
  stop running this by hand — build the actual CLI.
- **2026-08-15** — `repoguard` CLI is up: `audit` command with table/json/md output and
  `--min-score` for CI gating. Ran it against this repo for the first time — scored itself
  honestly low, since none of the `.github/` files exist yet. **Next:** stop testing this
  locally only — wire real CI so pushes actually get checked.
- **2026-08-16** — GitHub Actions CI (lint/typecheck/test/build on a Node 18/20 matrix) and a
  CodeQL scanning workflow. **Next:** the actual point of this project — make it audit
  *itself* on every PR instead of just sitting there as a CLI nobody uses in CI.
- **2026-08-17** — Self-audit workflow: builds the CLI and runs it against this repo on every
  PR, posting the score as a sticky PR comment and a job summary. Also added the Changesets
  release pipeline and a composite `action.yml` so this can eventually run as a GitHub Action
  in *other* repos, not just via npm install. **Next:** the score is still bad because the
  governance files (CODEOWNERS, Dependabot, templates) don't exist yet — add them.
- **2026-08-18** — Added CODEOWNERS, `dependabot.yml` (npm + github-actions), PR template, and
  issue templates. Ran `repoguard audit` against this repo and it finally scores well.
  **Next:** write the docs a stranger landing on this repo would actually need.
