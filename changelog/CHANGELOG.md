# Changelog



## v1.4.0 — Polish
*2026-06-30*

CI-friendly validation, pipeline-ready version output, local preview, and scoped changelog builds.

### New

- ship-notes validate — checks all release files for schema errors, exits non-zero on failure ([#](https://github.com/Shaelz/ship-notes/commit/940a3de)) — Shaelz
- ship-notes latest — prints the latest version number to stdout, useful in CI pipelines and shell scripts ([#](https://github.com/Shaelz/ship-notes/commit/940a3de)) — Shaelz
- ship-notes preview — starts the local SvelteKit dev server from anywhere in the project tree ([#](https://github.com/Shaelz/ship-notes/commit/940a3de)) — Shaelz
- ship-notes build --since <version> — scopes changelog output to releases at or after the given version ([#](https://github.com/Shaelz/ship-notes/commit/940a3de)) — Shaelz

## v1.3.0 — Integrations
*2026-06-30*

Post releases to GitHub and notify your team on Slack or Discord with a single command.

### New

- ship-notes publish --github [version] — posts a release to GitHub Releases via the API ([#](https://github.com/Shaelz/ship-notes/commit/55dcc12)) — Shaelz
- ship-notes notify [version] — sends a formatted release summary to a Slack or Discord webhook ([#](https://github.com/Shaelz/ship-notes/commit/55dcc12)) — Shaelz
- notify_webhook config field — set in ship-notes.toml or via SHIP_NOTES_WEBHOOK env var ([#](https://github.com/Shaelz/ship-notes/commit/55dcc12)) — Shaelz

## v1.2.0 — CLI Completeness
*2026-06-30*

A full command surface for the common release workflow — view, diff, share, and deploy.

### New

- ship-notes open — opens the configured changelog URL in the system browser ([#](https://github.com/Shaelz/ship-notes/commit/3a8f633)) — Shaelz
- ship-notes diff [version|v1..v2] — prints release(s) as Markdown to stdout, ready to paste into GitHub release notes or Slack ([#](https://github.com/Shaelz/ship-notes/commit/3a8f633)) — Shaelz
- ship-notes digest [version] — writes an HTML email digest to changelog/, table-based layout ready to paste into any mailer ([#](https://github.com/Shaelz/ship-notes/commit/3a8f633)) — Shaelz
- Netlify deployment config (netlify.toml) and GitHub Pages workflow included out of the box ([#](https://github.com/Shaelz/ship-notes/commit/3a8f633)) — Shaelz

## v1.1.0 — Init
*2026-06-30*

Bootstrap a new project with a single command.

### New

- ship-notes init — interactive wizard that scaffolds ship-notes.toml and releases/ in a new project ([#](https://github.com/Shaelz/ship-notes/commit/17538da)) — Shaelz
- Prompts for title, URL, repo, and default author — falls back to git config for repo URL and author name ([#](https://github.com/Shaelz/ship-notes/commit/17538da)) — Shaelz

## v1.0.0 — Credits
*2026-06-30*

Contributor credits, author linking, and a major internal cleanup. The site is now a single shared component.

### New

- Author credits per item — author field on release items, shown as a linked tag on the site ([#](https://github.com/Shaelz/ship-notes/commit/9195ad0)) — Shaelz
- default_author config — falls back to git config user.name when not set ([#](https://github.com/Shaelz/ship-notes/commit/9195ad0)) — Shaelz
- default_author_url — fallback link for author tags when no commit link is present ([#](https://github.com/Shaelz/ship-notes/commit/301a21a)) — Shaelz

### Changed

- Site release view extracted into a shared Release.svelte component — eliminates duplicated markup between index and version pages ([#](https://github.com/Shaelz/ship-notes/commit/362c828)) — Shaelz
- RSS feed title now reads from ship-notes.toml instead of being hardcoded ([#](https://github.com/Shaelz/ship-notes/commit/362c828)) — Shaelz
- loadSiteConfig called once per request — no longer duplicated between feed and release loader ([#](https://github.com/Shaelz/ship-notes/commit/362c828)) — Shaelz

## v0.3.0 — Ship It
*2026-06-29*

Deployment and site polish. The changelog is now live at ship-notes.gerbenvdvelde.nl.

### New

- Vercel deployment with auto-deploy on push to main ([#](https://github.com/Shaelz/ship-notes/commit/642b05c)) — Shaelz
- Favicon — >_ on dark background ([#](https://github.com/Shaelz/ship-notes/commit/4f223bd)) — Shaelz

### Fixed

- Index page now renders the latest release directly instead of redirecting ([#](https://github.com/Shaelz/ship-notes/commit/54bd7a3)) — Shaelz

### Changed

- Site URL updated to ship-notes.gerbenvdvelde.nl ([#](https://github.com/Shaelz/ship-notes/commit/80dcee0)) — Shaelz

## v0.2.0 — The Site
*2026-06-29*

Changelog site, RSS feed, and project config. The tool now produces something you can actually publish.

### New

- SvelteKit static changelog site with sidebar version history and current release indicator ([#](https://github.com/Shaelz/ship-notes/commit/ed1e2e3)) — Shaelz
- RSS feed at /feed.xml ([#](https://github.com/Shaelz/ship-notes/commit/e273485)) — Shaelz
- ship-notes.toml project config — set title, url, repo, and custom output paths ([#](https://github.com/Shaelz/ship-notes/commit/e273485)) — Shaelz

### Changed

- build command now respects releases_dir and output_dir from ship-notes.toml ([#](https://github.com/Shaelz/ship-notes/commit/e273485)) — Shaelz

## v0.1.0 — First Ship
*2026-06-29*

The initial release. Editorial mode only — write your releases, get beautiful output.

### New

- Release file format (TOML) with validation ([#](https://github.com/Shaelz/ship-notes/commit/87a6e6c)) — Shaelz
- Markdown changelog output ([#](https://github.com/Shaelz/ship-notes/commit/87a6e6c)) — Shaelz
- ship-notes add command with semver bump and file scaffold ([#](https://github.com/Shaelz/ship-notes/commit/bd8baa6)) — Shaelz
