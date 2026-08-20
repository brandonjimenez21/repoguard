# RepoGuard

A CLI (and GitHub Action) that audits a repository against the engineering practices GitHub
itself provides — CI, code scanning, dependency updates, review routing, licensing, docs — and
prints a weighted health score, from 0 to 100.

```
$ repoguard audit --path .

┌───┬────────────────────────────┬────────────┬────────┬───────────────────────────────────────────┐
│   │ Check                      │ Category   │ Weight │ Detail                                     │
├───┼────────────────────────────┼────────────┼────────┼───────────────────────────────────────────┤
│ ✔ │ Continuous Integration     │ ci         │ 20     │ 3 workflow(s), triggered on push/PR        │
│ ✔ │ Code scanning (CodeQL)     │ security   │ 15     │ Configured in .github/workflows/codeql.yml │
│ ✔ │ Dependabot                 │ security   │ 15     │ Watching: npm, github-actions              │
│ ✘ │ CODEOWNERS                 │ governance │ 10     │ No CODEOWNERS file                         │
│ ✔ │ License                    │ governance │ 10     │ LICENSE present                            │
...
└───┴────────────────────────────┴────────────┴────────┴───────────────────────────────────────────┘

Score: 82/100 (82%)  Grade: B
```

## Why this exists

Most "best practices" advice for a repo is scattered across docs nobody rereads. RepoGuard
turns it into something concrete: a score you can put in CI and watch move as you adopt each
practice — and this repository dogfoods every one of them on itself (see [How this repo uses
its own kit](#how-this-repo-uses-its-own-kit) below).

## Install

```bash
npm install -g repoguard
# or run without installing
npx repoguard audit
```

## Usage

```bash
repoguard audit --path . --format table   # default: colored table to stdout
repoguard audit --format json             # machine-readable
repoguard audit --format md --out report.md   # for a PR comment / job summary
repoguard audit --min-score 70            # exits 1 if below threshold — use in CI
```

As a GitHub Action, in any repo:

```yaml
- uses: brandonjimenez21/repoguard@v1
  with:
    min-score: '70'
```

## What it checks today (`v0.1`, no token needed)

| Check | Category | Weight |
|---|---|---|
| CI workflow present, triggers on push/PR | ci | 20 |
| CodeQL code scanning configured | security | 15 |
| Dependabot configured | security | 15 |
| CODEOWNERS defines ownership | governance | 10 |
| LICENSE present | governance | 10 |
| README has real content | docs | 10 |
| PR template present | governance | 8 |
| Issue templates present | governance | 7 |
| SECURITY.md present | security | 5 |

Checks that live in repo *settings* rather than files — branch protection, merge queue,
security-feature toggles, releases — need the GitHub API and are tracked in
[`ROADMAP.md`](./ROADMAP.md) for `v0.2`.

## Architecture

A pnpm workspace with two packages, kept separate so the audit logic is usable as a library
independent of the CLI:

```
packages/
  core/   @repoguard/core — pure audit engine: checks, scoring, no I/O beyond the filesystem
  cli/    repoguard       — commander-based CLI: argument parsing + table/json/md rendering
action.yml                — composite GitHub Action wrapping the published CLI
```

Each check in `packages/core/src/checks/` is a small, independently testable unit implementing
one interface (`id`, `category`, `weight`, `run(repoPath)`). Adding a check never touches
scoring or rendering — see [`CONTRIBUTING.md`](./CONTRIBUTING.md).

**Stack:** TypeScript (strict, ESM/NodeNext), pnpm workspaces, Vitest, ESLint + Prettier,
Commander, Changesets for versioning/publishing.

## How this repo uses its own kit

| Tool | Where |
|---|---|
| **GitHub Actions** | `ci.yml` (lint/typecheck/test/build on a Node 18/20 matrix) |
| **CODEOWNERS** | `.github/CODEOWNERS` — routes PRs by folder |
| **Dependabot** | `.github/dependabot.yml` — npm + github-actions, weekly |
| **Security tab (CodeQL)** | `.github/workflows/codeql.yml` — push/PR/weekly schedule |
| **Security tab (secrets)** | Enable *secret scanning* + *push protection* in Settings → Security |
| **Environments & Secrets** | `npm-publish` environment gates the `NPM_TOKEN` behind manual approval in `release.yml` |
| **Releases** | Changesets → `release.yml` opens a version PR, merges publish to npm with a generated changelog |
| **Branch protection** | `main` requires CI green + 1 approval before merge (Settings → Branches) |
| **Merge queue** | Enabled on `main` once PR volume justifies it |
| **Projects + Issues** | Roadmap items in `ROADMAP.md` become Issues on the Project board; PRs close them via `Closes #N` |
| **gh-stack** | Used for any change too large for one PR — see `CONTRIBUTING.md` |

Settings-only items (branch protection, merge queue, environments, security toggles) can't be
committed as files — see [`SETUP.md`](./SETUP.md) for the exact checklist to enable them after
pushing this repo to GitHub.

## Devlog

Kept as a running log while this was built solo — leaving it in because "what did I actually
build, in what order, and why" is more useful to a reader than a changelog that only lists
version numbers.

- **2026-08-10** — Repo scaffolded: pnpm workspace, strict TypeScript base config, ESLint,
  Prettier, Vitest wired up. Nothing runs yet.
- **2026-08-11** — `@repoguard/core` scaffolded: the `Check`/`CheckResult`/`AuditReport` types,
  a weighted pass/warn/fail scoring model, and small fs helpers checks would share.
- **2026-08-12** — Implemented all 9 filesystem-based checks: CI workflow, CodeQL, Dependabot,
  CODEOWNERS, license, security policy, PR template, issue templates, README quality.
- **2026-08-13** — Unit tests for every check plus the scoring aggregator, using temp
  directories instead of committed fixtures (`makeTempRepo()`). 19 tests, all green.
- **2026-08-15** — `repoguard` CLI is up: `audit` command with table/json/md output and
  `--min-score` for CI gating. Ran it against this repo for the first time — scored itself
  honestly low, since none of the `.github/` files existed yet.
- **2026-08-16** — GitHub Actions CI (lint/typecheck/test/build matrix) and a CodeQL scanning
  workflow.
- **2026-08-17** — Self-audit workflow posts the score as a PR comment now; added the
  Changesets release pipeline and the composite `action.yml` for Marketplace distribution.
- **2026-08-18** — CODEOWNERS, Dependabot, PR/issue templates. The tool finally scores itself
  well instead of failing its own checks.
- **2026-08-19** — Full docs pass: README, `ROADMAP.md` (the settings-only checks — branch
  protection, merge queue — that need the GitHub API), `CONTRIBUTING.md`, `SECURITY.md`,
  `SETUP.md`. Scored the repo against itself end to end: 100/100.
- **2026-08-19** — Pushed to GitHub. First real CI run failed immediately:
  `pnpm/action-setup`'s `version: 9` input conflicts with the `packageManager` field in
  `package.json` (`ERR_PNPM_BAD_PM_VERSION`) — removed the redundant input. Then `Release`
  failed too, for a legitimate reason this time: no `NPM_TOKEN` secret yet, so
  `changeset publish` has nothing to auth with. Guarded that step so it skips cleanly instead
  of going red on every push until `SETUP.md` step 6 is done. **Next:** work through the rest
  of `SETUP.md` (branch protection, merge queue, environments, Project board), then start
  turning `ROADMAP.md` into real Issues.

## License

MIT — see [`LICENSE`](./LICENSE).
