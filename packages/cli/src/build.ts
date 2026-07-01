import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { execSync } from 'node:child_process';
import { parseReleaseFile, ParseError, compareSemver } from '@ship-notes/core';
import { renderChangelog } from './render/markdown.js';
import { applyDefaultAuthor } from './releases.js';
import { loadConfig } from './config.js';

function gitAuthorName(): string {
  try {
    return execSync('git config user.name', { encoding: 'utf-8' }).trim();
  } catch {
    return '';
  }
}

export function parseSinceFlag(args: string[]): string | undefined {
  const eqForm = args.find((a) => a.startsWith('--since='))?.slice('--since='.length);
  const spaceForm = args.includes('--since') ? args[args.indexOf('--since') + 1] : undefined;
  return (eqForm ?? spaceForm)?.replace(/^v/, '');
}

export function build(args: string[]): void {
  const since = parseSinceFlag(args);

  const cwd = process.cwd();
  const config = loadConfig(cwd);

  if (!config.default_author) {
    config.default_author = gitAuthorName();
  }

  const releasesDir = resolve(cwd, config.releases_dir);

  let files: string[];
  try {
    files = readdirSync(releasesDir).filter((f) => f.endsWith('.toml'));
  } catch {
    console.error(`Error: ${config.releases_dir}/ directory not found. Run from your project root.`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.error(`Error: no .toml files found in ${config.releases_dir}/`);
    process.exit(1);
  }

  const releases = [];
  let hasErrors = false;

  for (const file of files) {
    try {
      releases.push(parseReleaseFile(join(releasesDir, file)));
    } catch (err) {
      if (err instanceof ParseError) {
        console.error(err.message);
        hasErrors = true;
      } else {
        throw err;
      }
    }
  }

  if (hasErrors) process.exit(1);

  releases.sort((a, b) => compareSemver(a.version, b.version));
  applyDefaultAuthor(releases, config);

  const filtered = since
    ? releases.filter((r) => compareSemver(r.version, since) <= 0)
    : releases;

  if (filtered.length === 0) {
    console.error(`Error: no releases found at or after v${since}`);
    process.exit(1);
  }

  const outDir = resolve(cwd, config.output_dir);
  mkdirSync(outDir, { recursive: true });

  writeFileSync(join(outDir, 'CHANGELOG.md'), renderChangelog(filtered), 'utf-8');
  console.log(`Built ${filtered.length} release(s) → ${config.output_dir}/CHANGELOG.md`);
}
