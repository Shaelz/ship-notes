# ship-notes

Turn your git history into human-readable release notes.

`git log` is for developers. Release notes are for users. ship-notes bridges that gap with taste and editorial control — no "AI wrote this" feel, no raw commit dumps.

## How it works

ship-notes reads structured release files you write (one per version), assembles them into a formatted changelog, and optionally publishes a static changelog site with version history and an RSS feed.

You stay in control of the words. The tool handles the formatting, sorting, and publishing.

## Modes

**Editorial mode** (v1) — you write a `releases/v1.2.0.toml` file per release. ship-notes makes it beautiful on output. Markdown, HTML, or structured JSON/TOML for downstream use.

**Generation mode** (planned) — feed it commits, get a draft back. Rule-based (commit prefix parsing) or AI-assisted. Always editorial-review before publish.

## Release file format

```toml
version = "1.2.0"
date = "2026-06-29"
name = "Summer Update"        # optional display name

[sections.new]
label = "What's New"          # optional, defaults to "New"

[[sections.new.items]]
text = "Dark mode support across all pages"

[[sections.new.items]]
text = "Export to PDF"
pr = "https://github.com/user/repo/pull/42"

[sections.fixed]

[[sections.fixed.items]]
text = "Crash on empty project list"

[sections.changed]

[[sections.changed.items]]
text = "API response format for /projects now returns ISO dates"
breaking = true
```

### Standard sections

| Key        | Default label |
|------------|---------------|
| `new`      | New           |
| `fixed`    | Fixed         |
| `changed`  | Changed       |
| `removed`  | Removed       |

Any section label can be overridden. Extra sections (e.g. `migration`, `known_issues`) are supported as free-form entries.

### Item fields

| Field      | Type    | Required | Description                          |
|------------|---------|----------|--------------------------------------|
| `text`     | string  | yes      | The human-readable change description |
| `pr`       | string  | no       | Link to the pull request or issue    |
| `breaking` | boolean | no       | Marks the item as a breaking change  |

## Project structure

```
your-project/
├── ship-notes.toml       # project config (audience, output format, site settings)
├── releases/
│   ├── v1.2.0.toml
│   ├── v1.1.0.toml
│   └── v1.0.0.toml
└── changelog/            # generated output (gitignore or commit, your call)
    ├── index.html
    ├── feed.xml
    └── CHANGELOG.md
```

## CLI

```sh
ship-notes add            # scaffold a new release file for the next version
ship-notes build          # assemble all releases into output formats
ship-notes publish        # build + deploy to configured host
```

## Aesthetic

The published changelog site follows a retro software release page aesthetic — version numbers as section headers, a sidebar version history, a persistent current-version indicator. Intentional retro, not ironic.

## Stack

- **CLI**: Node.js
- **Site**: SvelteKit, prerendered static output
- **Storage**: file-based, local-first, no database

## Status

Early development. See [ROADMAP.md](ROADMAP.md).
