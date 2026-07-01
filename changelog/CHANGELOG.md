# Changelog



## v1.5.1 — Consistency fixes
*2026-07-01*

A round of correctness fixes found during a full audit: a crashing flag, dropped author links, and inconsistent behavior across commands.

### Fixed

- ship-notes build --since=v1.2.0 no longer crashes — the = form now strips the v prefix the same way the space-separated form does — [Shaelz](https://github.com/Shaelz/ship-notes/commit/829e444)
- Markdown changelogs, GitHub release bodies, and HTML digests now link author credit via author_url, matching the site — [Shaelz](https://github.com/Shaelz/ship-notes/commit/0fb2091)
- ship-notes notify now uses Discord's bold syntax for Discord webhooks instead of Slack's, which Discord was rendering as italic — [Shaelz](https://github.com/Shaelz/ship-notes/commit/63ab67c)
- diff, digest, publish, and notify now respect releases_dir in error messages and fall back to git config user.name for authorship, matching build and the site — [Shaelz](https://github.com/Shaelz/ship-notes/commit/0f6234b)
- ship-notes preview now explains it requires a clone or fork of the repo instead of implying a cwd mistake — [Shaelz](https://github.com/Shaelz/ship-notes/commit/fb3b386)

## v1.5.0 — Site & reliability
*2026-06-30*

SEO-ready changelog site, config consistency fixes, and a round of correctness work across the deploy pipeline.

### New

- Changelog site now has proper page titles, meta descriptions, canonical URLs, and Open Graph tags on every page — [Shaelz](https://github.com/Shaelz/ship-notes/commit/f78f873)
- robots.txt and sitemap.xml generated automatically from your configured url when deployed — [Shaelz](https://github.com/Shaelz/ship-notes/commit/f78f873)
- OG preview image (/og.png) served with the site for social sharing — [Shaelz](https://github.com/Shaelz/ship-notes/commit/f78f873)

### Fixed

- ship-notes add and ship-notes latest now respect releases_dir from config instead of always defaulting to releases/ — [Shaelz](https://github.com/Shaelz/ship-notes/commit/b35fa23)
- Hard-refreshing a deep URL (/about, /v/1.2.0, etc.) on Vercel no longer returns 404 — [Shaelz](https://github.com/Shaelz/ship-notes/commit/c871ec9)
- A malformed release TOML file in releases/ no longer crashes the site dev server — it logs a warning and skips that file — [Shaelz](https://github.com/Shaelz/ship-notes/commit/f3ce38c)
- Production site build was broken due to node:fs leaking into the browser bundle through an unshaken core re-export; fixed with a browser-safe entry point in @ship-notes/core — [Shaelz](https://github.com/Shaelz/ship-notes/commit/5388063)
- All deploy configs (Vercel, Netlify, GitHub Pages, npm publish) were missing the @ship-notes/core build step and would fail on a clean checkout — [Shaelz](https://github.com/Shaelz/ship-notes/commit/9d03416)

## v1.4.0 — Polish
*2026-06-30*

CI-friendly validation, pipeline-ready version output, local preview, and scoped changelog builds.

### New

- ship-notes validate — checks all release files for schema errors, exits non-zero on failure — [Shaelz](https://github.com/Shaelz/ship-notes/commit/940a3de)
- ship-notes latest — prints the latest version number to stdout, useful in CI pipelines and shell scripts — [Shaelz](https://github.com/Shaelz/ship-notes/commit/940a3de)
- ship-notes preview — starts the local SvelteKit dev server from anywhere in the project tree — [Shaelz](https://github.com/Shaelz/ship-notes/commit/940a3de)
- ship-notes build --since <version> — scopes changelog output to releases at or after the given version — [Shaelz](https://github.com/Shaelz/ship-notes/commit/940a3de)

## v1.3.0 — Integrations
*2026-06-30*

Post releases to GitHub and notify your team on Slack or Discord with a single command.

### New

- ship-notes publish --github [version] — posts a release to GitHub Releases via the API — [Shaelz](https://github.com/Shaelz/ship-notes/commit/55dcc12)
- ship-notes notify [version] — sends a formatted release summary to a Slack or Discord webhook — [Shaelz](https://github.com/Shaelz/ship-notes/commit/55dcc12)
- notify_webhook config field — set in ship-notes.toml or via SHIP_NOTES_WEBHOOK env var — [Shaelz](https://github.com/Shaelz/ship-notes/commit/55dcc12)

## v1.2.0 — CLI Completeness
*2026-06-30*

A full command surface for the common release workflow — view, diff, share, and deploy.

### New

- ship-notes open — opens the configured changelog URL in the system browser — [Shaelz](https://github.com/Shaelz/ship-notes/commit/3a8f633)
- ship-notes diff [version|v1..v2] — prints release(s) as Markdown to stdout, ready to paste into GitHub release notes or Slack — [Shaelz](https://github.com/Shaelz/ship-notes/commit/3a8f633)
- ship-notes digest [version] — writes an HTML email digest to changelog/, table-based layout ready to paste into any mailer — [Shaelz](https://github.com/Shaelz/ship-notes/commit/3a8f633)
- Netlify deployment config (netlify.toml) and GitHub Pages workflow included out of the box — [Shaelz](https://github.com/Shaelz/ship-notes/commit/3a8f633)

## v1.1.0 — Init
*2026-06-30*

Bootstrap a new project with a single command.

### New

- ship-notes init — interactive wizard that scaffolds ship-notes.toml and releases/ in a new project — [Shaelz](https://github.com/Shaelz/ship-notes/commit/17538da)
- Prompts for title, URL, repo, and default author — falls back to git config for repo URL and author name — [Shaelz](https://github.com/Shaelz/ship-notes/commit/17538da)

## v1.0.0 — Credits
*2026-06-30*

Contributor credits, author linking, and a major internal cleanup. The site is now a single shared component.

### New

- Author credits per item — author field on release items, shown as a linked tag on the site — [Shaelz](https://github.com/Shaelz/ship-notes/commit/9195ad0)
- default_author config — falls back to git config user.name when not set — [Shaelz](https://github.com/Shaelz/ship-notes/commit/9195ad0)
- default_author_url — fallback link for author tags when no commit link is present — [Shaelz](https://github.com/Shaelz/ship-notes/commit/301a21a)

### Changed

- Site release view extracted into a shared Release.svelte component — eliminates duplicated markup between index and version pages — [Shaelz](https://github.com/Shaelz/ship-notes/commit/362c828)
- RSS feed title now reads from ship-notes.toml instead of being hardcoded — [Shaelz](https://github.com/Shaelz/ship-notes/commit/362c828)
- loadSiteConfig called once per request — no longer duplicated between feed and release loader — [Shaelz](https://github.com/Shaelz/ship-notes/commit/362c828)

## v0.3.0 — Ship It
*2026-06-29*

Deployment and site polish. The changelog is now live at ship-notes.gerbenvdvelde.nl.

### New

- Vercel deployment with auto-deploy on push to main — [Shaelz](https://github.com/Shaelz/ship-notes/commit/642b05c)
- Favicon — >_ on dark background — [Shaelz](https://github.com/Shaelz/ship-notes/commit/4f223bd)

### Fixed

- Index page now renders the latest release directly instead of redirecting — [Shaelz](https://github.com/Shaelz/ship-notes/commit/54bd7a3)

### Changed

- Site URL updated to ship-notes.gerbenvdvelde.nl — [Shaelz](https://github.com/Shaelz/ship-notes/commit/80dcee0)

## v0.2.0 — The Site
*2026-06-29*

Changelog site, RSS feed, and project config. The tool now produces something you can actually publish.

### New

- SvelteKit static changelog site with sidebar version history and current release indicator — [Shaelz](https://github.com/Shaelz/ship-notes/commit/ed1e2e3)
- RSS feed at /feed.xml — [Shaelz](https://github.com/Shaelz/ship-notes/commit/e273485)
- ship-notes.toml project config — set title, url, repo, and custom output paths — [Shaelz](https://github.com/Shaelz/ship-notes/commit/e273485)

### Changed

- build command now respects releases_dir and output_dir from ship-notes.toml — [Shaelz](https://github.com/Shaelz/ship-notes/commit/e273485)

## v0.1.0 — First Ship
*2026-06-29*

The initial release. Editorial mode only — write your releases, get beautiful output.

### New

- Release file format (TOML) with validation — [Shaelz](https://github.com/Shaelz/ship-notes/commit/87a6e6c)
- Markdown changelog output — [Shaelz](https://github.com/Shaelz/ship-notes/commit/87a6e6c)
- ship-notes add command with semver bump and file scaffold — [Shaelz](https://github.com/Shaelz/ship-notes/commit/bd8baa6)
