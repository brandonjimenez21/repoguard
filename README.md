# RepoGuard

A CLI (and eventually a GitHub Action) that audits a repository against real engineering
practices — CI, security scanning, dependency updates, review routing, docs — and prints a
weighted health score.

Very early stage. See the devlog below for where this actually is.

## Devlog

- **2026-08-10** — Repo scaffolded: pnpm workspace, strict TypeScript base config, ESLint,
  Prettier, Vitest wired up. Nothing runs yet. **Next:** design the data model for a "check"
  and how scoring should work before writing any real audit logic.
