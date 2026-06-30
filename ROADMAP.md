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
- [ ] `ship-notes preview --audience <name>` — local dev server filtered to that audience
- [ ] Site: audience switcher UI

## v1.2 — CLI completeness ✓

- [x] `ship-notes open` — open the deployed changelog in the browser
- [x] `ship-notes diff [<version>|<v1>..<v2>]` — print release(s) as Markdown to stdout
- [x] `ship-notes digest [<version>]` — write an HTML email digest to `changelog/`
- [x] Non-Vercel hosting support — `netlify.toml` and GitHub Pages workflow included

## v1.3 — Onboarding & personality

- [x] `ship-notes init` — interactive wizard that scaffolds `ship-notes.toml` and `releases/` for a new project
- [x] Contributor credits per item — `author` field, rendered as a linked tag on the site and in Markdown output

## v1.4 — Integrations & CLI polish ✓

- [x] `ship-notes publish --github [<version>]` — post the release to GitHub Releases via the API (requires `GITHUB_TOKEN`)
- [x] `ship-notes notify [<version>]` — send a formatted release summary to a configured Slack or Discord webhook (`notify_webhook` in config or `SHIP_NOTES_WEBHOOK` env var)
- [x] `ship-notes preview` — start a local preview of the changelog site
- [x] `ship-notes validate` — check all release files for schema errors (CI-friendly)
- [x] `ship-notes latest` — print the latest version number (useful in scripts and pipelines)
- [x] `ship-notes build --since <version>` — scope output to releases at or after a given version

## v1.5 — Monorepo support

- [ ] `ship-notes.workspace.toml` — aggregates releases from sub-packages into a unified changelog view
- [ ] Per-package release files with a combined site output

## v2.0 — Generation mode

- [ ] `ship-notes draft` — parse git log into a draft release file
- [ ] Rule-based: commit prefix mapping (`feat:` → new, `fix:` → fixed, etc.)
- [ ] AI-assisted: rewrite commit messages into user-facing prose
- [ ] Always outputs a draft for editorial review — never auto-publishes
- [ ] GitHub Action: trigger `ship-notes draft` automatically on tag push

## Technical debt

- Social preview image — GitHub repo has no OG image; a simple branded card would improve shareability.

## Deferred / maybe

- Date-based version schemes
- Per-project vs. central multi-project tracking
- Hosted changelog service (ship-notes.io or similar)
