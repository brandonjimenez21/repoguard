# Setup checklist

Everything in this repo that's a *file* is already wired up. These are the pieces that only
exist as GitHub repo settings — you do these once, from your own account, after pushing.

## 1. Fix placeholders

- [x] Replace `@your-github-username` in `.github/CODEOWNERS` → `@brandonjimenez21`
- [x] Replace `your-github-username` in `action.yml` (`author:`) and `README.md`
- [ ] Confirm the name/year in `LICENSE`

## 2. Push the repo

The repo already exists at `github.com/brandonjimenez21/repoguard`.

```bash
git remote add origin https://github.com/brandonjimenez21/repoguard.git
git push -u origin main
```

## 3. Branch protection (Settings → Branches → Add rule for `main`)

- [ ] Require a pull request before merging
- [ ] Require status checks to pass: select the `build-test` job from CI once it has run once
- [ ] Require at least 1 approval (fine to set to 0 while solo, revisit once you have reviewers)
- [ ] Do not allow direct pushes to `main`

## 4. Merge queue (Settings → Branches → same rule)

- [ ] Enable "Require merge queue" — works even at low PR volume, it's here to show the setting
      is understood, not because you need it yet at solo-dev scale

## 5. Security tab (Settings → Code security and analysis)

- [ ] Dependabot alerts: on
- [ ] Dependabot security updates: on
- [ ] Secret scanning: on
- [ ] Push protection: on
- [ ] Code scanning: should auto-detect `codeql.yml` once it runs once

## 6. Environments (Settings → Environments → New environment)

- [ ] Create `npm-publish`
- [ ] Add yourself as a required reviewer (so publishing needs manual approval)
- [ ] Add secret `NPM_TOKEN` (an npm automation token) scoped to this environment

## 7. Projects + Issues

- [ ] Create a Project (v2) board, columns: `Todo`, `In progress`, `Done`
- [ ] Turn each unchecked item in `ROADMAP.md` into an Issue, add to the board
- [ ] Link the repo to the Project (Project → Settings → Linked repositories)

## 8. First release

- [ ] `pnpm changeset` once you have something worth publishing
- [ ] Merge to `main` → `release.yml` opens a "Version Packages" PR
- [ ] Merge that PR → npm publish runs (pending the `npm-publish` environment approval)
- [ ] Tag `action.yml`'s major version (`v1`) per Actions Marketplace convention, then list it
      on the Marketplace if you want it discoverable
