# Contributing

## Setup

```sh
git clone https://github.com/Shaelz/ship-notes.git
cd ship-notes
pnpm install
```

## Project structure

```
packages/
  core/  — shared library: schema, parser, semver, section helpers (@ship-notes/core)
  cli/   — Node.js CLI, depends on core
  site/  — SvelteKit changelog site (adapter-static, prerendered), depends on core
releases/          — ship-notes' own release TOML files
changelog/         — generated output (ship-notes build)
```

## Development

**Core** (build first — CLI and site both depend on it):
```sh
pnpm --filter @ship-notes/core build  # compile TypeScript
pnpm --filter @ship-notes/core dev    # watch mode
```

**CLI:**
```sh
pnpm --filter ship-notes build   # compile TypeScript
pnpm --filter ship-notes dev     # watch mode
pnpm --filter ship-notes test    # run tests
```

**Site:**
```sh
pnpm --filter @ship-notes/site dev    # local dev server at localhost:5173
pnpm --filter @ship-notes/site build  # production static build
```

**CLI against this repo:**
```sh
node packages/cli/dist/index.js build    # regenerate changelog/CHANGELOG.md
node packages/cli/dist/index.js validate # check all release files
```

## Tests

Tests live in `packages/cli/src/test/` and use Node's built-in test runner — no extra dependencies. Run with `pnpm --filter ship-notes test`.

Add tests for new logic in `packages/core/src/` (schema, semver, parse) or any new utility. CLI command integration (file I/O, process.argv) doesn't need unit tests — keep the test surface focused on pure functions.

## Adding a release

```sh
node packages/cli/dist/index.js add <version>
# fill in releases/v<version>.toml
node packages/cli/dist/index.js build
```

## Publishing to npm

Releases are published automatically when a `v*` tag is pushed. Requires an `NPM_TOKEN` secret in the repo settings.

```sh
git tag v1.5.0
git push origin v1.5.0
```

## Pull requests

- One logical change per PR
- Run `pnpm --filter ship-notes test` before pushing
- Follow the existing commit prefix style (`feat:`, `fix:`, `chore:`, `refactor:`)
