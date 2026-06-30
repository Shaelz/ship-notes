# ship-notes

Turn your git history into human-readable release notes.

`git log` is for developers. Release notes are for users. ship-notes bridges that gap with taste and editorial control — no "AI wrote this" feel, no raw commit dumps.

## Install

```sh
npm install -D ship-notes
# or
pnpm add -D ship-notes
```

## How it works

ship-notes reads structured release files you write (one per version), assembles them into a formatted changelog, and optionally publishes a static changelog site with version history and an RSS feed.

You stay in control of the words. The tool handles the formatting, sorting, and publishing.

## Modes

**Editorial mode** (v1) — you write a `releases/v1.2.0.toml` file per release. ship-notes makes it beautiful on output. Markdown or a prerendered static site with RSS.

**Generation mode** (planned) — feed it commits, get a draft back. Rule-based (commit prefix parsing) or AI-assisted. Always editorial-review before publish.

## Release file format

```toml
version = "1.2.0"
date    = "2026-06-29"
name    = "Summer Update"     # optional display name
summary = "One-line blurb shown above the sections."  # optional

[sections.new]
label = "What's New"          # optional, defaults to "New"

[[sections.new.items]]
text = "Dark mode support across all pages"

[[sections.new.items]]
text = "Export to PDF"
link = "https://github.com/user/repo/pull/42"
author = "Your Name"

[sections.changed]

[[sections.changed.items]]
text = "API response format for /projects now returns ISO dates"
breaking = true
```

### Standard sections

| Key       | Default label |
|-----------|---------------|
| `new`     | New           |
| `fixed`   | Fixed         |
| `changed` | Changed       |
| `removed` | Removed       |

Any section label can be overridden. Extra sections (e.g. `migration`, `known_issues`) are supported as free-form entries.

### Item fields

| Field        | Type    | Required | Description                                                      |
|--------------|---------|----------|------------------------------------------------------------------|
| `text`       | string  | yes      | The human-readable change description                            |
| `link`       | string  | no       | URL to the pull request, issue, or reference                     |
| `breaking`   | boolean | no       | Marks the item as a breaking change                              |
| `author`     | string  | no       | Contributor credit — overrides `default_author`                  |
| `author_url` | string  | no       | Profile link for the author tag; falls back to `default_author_url` |

### publish & notify

`ship-notes publish --github` requires a `GITHUB_TOKEN` env var with `contents: write` permission and `repo` set in `ship-notes.toml`.

`ship-notes notify` sends to the webhook at `notify_webhook` in `ship-notes.toml` (or `SHIP_NOTES_WEBHOOK` env var). Slack and Discord webhooks are both supported — detected automatically from the URL.

## Project config (`ship-notes.toml`)

```toml
title          = "My Project"
url            = "https://changelog.myproject.com"
repo           = "https://github.com/user/repo"
default_author     = "Your Name"                     # falls back to git config user.name
default_author_url = "https://github.com/user/repo"  # fallback link for author tags with no item link
notify_webhook     = "https://hooks.slack.com/..."    # or Discord webhook URL

# releases_dir = "releases"   # default
# output_dir   = "changelog"  # default
```

## Project structure

```
your-project/
├── ship-notes.toml
├── releases/
│   ├── v1.2.0.toml
│   ├── v1.1.0.toml
│   └── v1.0.0.toml
└── changelog/            # generated output — gitignore or commit, your call
    └── CHANGELOG.md
```

## CLI

```sh
ship-notes init                                # set up ship-notes in a new project
ship-notes add [patch|minor|major|<version>]   # scaffold a new release file
ship-notes build [--since <version>]           # assemble releases/ into changelog/CHANGELOG.md
ship-notes validate                            # check all release files for errors (CI-friendly)
ship-notes latest                              # print the latest version number
ship-notes open                                # open the deployed changelog in the browser
ship-notes preview                             # start a local preview of the changelog site
ship-notes diff [<version>|<v1>..<v2>]         # print release(s) as Markdown to stdout
ship-notes digest [<version>]                  # write an HTML email digest to changelog/
ship-notes publish --github [<version>]        # post a release to GitHub Releases
ship-notes notify [<version>]                  # send a release summary to Slack or Discord
```

### Getting started

```sh
cd your-project
ship-notes init
# → prompts for title, URL, repo, author
# → writes ship-notes.toml and creates releases/

ship-notes add 1.0.0
# → creates releases/v1.0.0.toml, fill it in

ship-notes build
# → writes changelog/CHANGELOG.md
```

## Site

The changelog site is a SvelteKit static site in `packages/site`. It reads `releases/*.toml` directly.

**Development** — the site reads release files live on every request, no build step needed:

```sh
pnpm --filter @ship-notes/site dev
```

**Production build** — prerenders all release pages to static HTML:

```sh
pnpm --filter @ship-notes/core build   # required first — site depends on core
pnpm --filter @ship-notes/site build
```

## Deployment

The site outputs static files and deploys anywhere that serves HTML.

**Vercel** — `vercel.json` is included. Connect the repo and push.

**Netlify** — `packages/site/netlify.toml` is included. Connect the repo and push.

**GitHub Pages** — `.github/workflows/deploy-pages.yml` is included. Enable Pages in repo settings (source: GitHub Actions), then push.

All three configs build `@ship-notes/core` first and handle the correct build order automatically. The deployed site generates `robots.txt`, `sitemap.xml`, and an OG preview image (`/og.png`) from your `ship-notes.toml` config.

## Aesthetic

Retro software release page — version numbers as large headers, sidebar version history, current release indicator. Space Mono throughout. Intentional retro, not ironic.

## Stack

- **Core** (`@ship-notes/core`): TypeScript, smol-toml, Zod — release schema, parser, semver utilities
- **CLI**: Node.js, depends on core
- **Site**: SvelteKit, prerendered static output, adapter-static, depends on core
- **Storage**: file-based, local-first, no database

## Status

v1.5 shipped. See [ROADMAP.md](ROADMAP.md).
