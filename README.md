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
