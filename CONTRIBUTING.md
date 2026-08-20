# Contributing

## Local setup

```bash
pnpm install
pnpm build
pnpm test
```

## Workflow

1. Every change starts as an **Issue** on the Project board (`Todo` column) — bugs and
   features alike.
2. Branch off `main`: `feature/<short-description>`. Nobody commits to `main` directly;
   branch protection blocks it.
3. Open a PR, link it with `Closes #<issue>`. CODEOWNERS assigns the reviewer automatically.
4. CI (`ci.yml`) and the self-audit workflow run automatically. Branch protection requires
   both green plus one approval before merge.
5. For a change too large to review as one unit, split it into a **stack** of small PRs with
   [`gh-stack`](https://github.com/github/gh-stack) instead of one giant diff:

   ```bash
   gh extension install github/gh-stack
   gh stack create feature/big-thing
   # commit incrementally, each commit becomes its own reviewable PR in the stack
   gh stack submit
   ```

6. If the change affects the published behavior of `@repoguard/core` or `repoguard`, add a
   changeset before merging:

   ```bash
   pnpm changeset
   ```

## Adding a new check

Checks live in `packages/core/src/checks/`. Each one implements the `Check` interface from
`packages/core/src/types.ts`: an id, a category, a point weight, and an async `run(repoPath)`
that returns a `severity` (`pass` / `warn` / `fail`) and a human-readable `message`. Register
it in `packages/core/src/checks/index.ts`, and add a `<name>.test.ts` next to it using
`makeTempRepo()` from `test-helpers.ts` to exercise the pass/warn/fail paths.
