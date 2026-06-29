# Roadmap

## v1.0 — Editorial foundation ✓

The core loop: write a release file, get beautiful output.

- [x] `release.toml` schema and parser
- [x] CLI: `ship-notes add` — scaffolds a new release file
- [x] CLI: `ship-notes build` — assembles releases into `changelog/CHANGELOG.md`
- [x] SvelteKit changelog site
  - [x] Version list sidebar
  - [x] Per-version release page
  - [x] Breaking change visual treatment (badge/indicator)
  - [x] Current version indicator
  - [x] RSS feed (`feed.xml`)
- [x] `ship-notes.toml` project config (output paths, site title, repo URL)
- [x] Vercel deployment with custom domain

## v1.1 — Audience targeting

Write once, render differently for end users vs. developers consuming an API.

- [ ] `[audience]` block in `ship-notes.toml` — define named audiences
- [ ] Per-item `audience = ["users", "developers"]` filter field
- [ ] CLI flag: `ship-notes build --audience developers`
- [ ] Site: audience switcher UI

## v1.2 — CLI completeness

- [ ] `ship-notes open` — open the deployed changelog in the browser
- [ ] Email digest output (HTML, ready to paste into a mailer)
- [ ] Non-Vercel hosting support (Netlify, GitHub Pages adapters) — for users not on Vercel auto-deploy

## v2.0 — Generation mode

- [ ] `ship-notes draft` — parse git log into a draft release file
- [ ] Rule-based: commit prefix mapping (`feat:` → new, `fix:` → fixed, etc.)
- [ ] AI-assisted: rewrite commit messages into user-facing prose
- [ ] Always outputs a draft for editorial review — never auto-publishes
- [ ] GitHub Action: trigger `ship-notes draft` automatically on tag push

## Technical debt

- Extract `packages/core` — shared package exporting the release schema (Zod), TOML parser, and semver utilities. Currently duplicated between `packages/cli` and `packages/site`. Both packages should depend on `@ship-notes/core` instead.

## Deferred / maybe

- Contributor credits per item
- Date-based version schemes
- Per-project vs. central multi-project tracking
- Hosted changelog service (ship-notes.io or similar)
