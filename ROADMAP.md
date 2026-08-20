# Roadmap

`v0.1` only inspects the filesystem — it works on any local clone, no GitHub token needed.
Several practices from the reference guide live in **repo settings**, not files, so they need
the GitHub REST/GraphQL API via a token. That's the next milestone. Each item below is meant
to become its own GitHub Issue on the Project board, not one big PR.

## Found while dogfooding — CI doesn't actually run the CLI

Discovered reviewing Dependabot PRs #7 (`commander` → 15) and #8 (`chalk` → 6): both require
Node 22, which breaks the `node: ">=18.18"` this repo declares and the 18.x/20.x matrix
`ci.yml` tests against. Every check on those PRs passed anyway, because nothing in the
pipeline actually *executes* `packages/cli`:

- `pnpm test` (Vitest) only covers `@repoguard/core` — `packages/cli` has zero test files.
- `pnpm build` type-checks with `tsc`; it never runs the compiled output.

So a dependency that's fine at the type level but broken at runtime on an older Node version
would sail through CI green. Fix:

- [x] Add a CLI smoke test — `packages/cli/scripts/smoke-test.mjs`, wired into `ci.yml` via
      `pnpm --filter repoguard run smoke` on the existing 18.x/20.x matrix. It runs the built
      `dist/index.js` against this repo and asserts: `--format json` exits 0 with a well-formed
      report, `--min-score` above the achieved score exits 1, and an unknown `--format` exits 2.
- [ ] Now that it exists, revisit the ignored `commander`/`chalk` major versions — either they
      pass for real, or the smoke test explains exactly why not

## v0.2 — API-backed checks (needs `--token` / `GITHUB_TOKEN`)

- [ ] `branch-protection` — required status checks + required approving reviews on the
      default branch (`GET /repos/{owner}/{repo}/branches/{branch}/protection`)
- [ ] `merge-queue` — merge queue enabled on the default branch
- [ ] `security-features` — secret scanning, secret scanning push protection, and Dependabot
      alerts enabled (`GET /repos/{owner}/{repo}` `security_and_analysis`)
- [ ] `releases` — at least one published Release / semver tag exists
- [ ] `--repo owner/name` mode that resolves an arbitrary GitHub repo instead of requiring a
      local clone

## v0.3 — Distribution

- [ ] Publish `repoguard` to npm (`release.yml` already wired to a protected `npm-publish`
      environment — just needs `NPM_TOKEN` added as a secret)
- [ ] Tag `action.yml` as `v1` per the
      [Actions Marketplace versioning convention](https://docs.github.com/actions/creating-actions/about-custom-actions#using-release-management-for-actions)
      and publish to the Marketplace
- [ ] `--fail-on <severity>` flag for stricter CI gating than `--min-score`

## Later / exploratory

- [ ] Pluggable check config (`.repoguardrc.json`) so a team can adjust weights or disable
      checks that don't apply to them
- [ ] `--compare <ref>` to diff a repo's score against a previous commit/tag
