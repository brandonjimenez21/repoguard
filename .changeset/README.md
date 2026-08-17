# Changesets

This directory holds pending version bumps. Run `pnpm changeset` when a PR changes the
published behavior of `@repoguard/core` or `repoguard`, answer the prompts (which package,
patch/minor/major, one-line summary), and commit the generated file alongside the PR.

On merge to `main`, `release.yml` opens a "Version Packages" PR that consumes these files into
a version bump + CHANGELOG entry; merging *that* PR triggers the actual npm publish.
