# Roadmap

## v1.0 — Editorial foundation

The core loop: write a release file, get beautiful output.

- [ ] `release.toml` schema and parser
- [ ] CLI: `ship-notes add` — scaffolds a new release file
- [ ] CLI: `ship-notes build` — assembles releases into output
- [ ] Output: Markdown (`CHANGELOG.md`)
- [ ] Output: HTML (single file, portable)
- [ ] SvelteKit changelog site
  - [ ] Version list sidebar
  - [ ] Per-version release page
  - [ ] Breaking change visual treatment (badge/indicator)
  - [ ] Current version indicator
  - [ ] RSS feed (`feed.xml`)
- [ ] `ship-notes.toml` project config (output paths, site title, repo URL)

## v1.1 — Audience targeting

Write once, render differently for end users vs. developers consuming an API.

- [ ] `[audience]` block in `ship-notes.toml` — define named audiences
- [ ] Per-item `audience = ["users", "developers"]` filter field
- [ ] CLI flag: `ship-notes build --audience developers`
- [ ] Site: audience switcher UI

## v1.2 — Publishing

- [ ] `ship-notes publish` — deploy to configured host
- [ ] Static host adapters: Netlify, Vercel, GitHub Pages
- [ ] Email digest output (HTML, ready to paste into a mailer)

## v2.0 — Generation mode

- [ ] `ship-notes draft` — parse git log into a draft release file
- [ ] Rule-based: commit prefix mapping (`feat:` → new, `fix:` → fixed, etc.)
- [ ] AI-assisted: rewrite commit messages into user-facing prose
- [ ] Always outputs a draft for editorial review — never auto-publishes

## Technical debt

- Extract `packages/core` — shared package exporting the release schema (Zod), TOML parser, and semver utilities. Currently duplicated between `packages/cli` and `packages/site`. Both packages should depend on `@ship-notes/core` instead.

## Deferred / maybe

- Contributor credits per item
- Date-based version schemes
- Per-project vs. central multi-project tracking
- Hosted changelog service (ship-notes.io or similar)
- GitHub Action for automatic draft generation on tag push
