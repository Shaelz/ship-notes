import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { parseReleaseFile, ParseError } from './parse.js';
import { renderDigest } from './render/html.js';
import { compareSemver } from './semver.js';
import { loadConfig } from './config.js';

export function digest(versionArg?: string): void {
  const cwd = process.cwd();
  const config = loadConfig(cwd);
  const releasesDir = resolve(cwd, config.releases_dir || 'releases');

  let files: string[];
  try {
    files = readdirSync(releasesDir).filter((f) => f.endsWith('.toml'));
  } catch {
    console.error(`Error: no ${config.releases_dir}/ directory found.`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.error(`Error: no .toml files found in ${config.releases_dir}/`);
    process.exit(1);
  }

  const releases = [];
  for (const file of files) {
    try {
      releases.push(parseReleaseFile(join(releasesDir, file)));
    } catch (err) {
      if (err instanceof ParseError) {
        console.error(err.message);
        process.exit(1);
      }
      throw err;
    }
  }
  releases.sort((a, b) => compareSemver(a.version, b.version));

  const version = versionArg?.replace(/^v/, '');
  const release = version
    ? releases.find((r) => r.version === version)
    : releases[0];

  if (!release) {
    console.error(version ? `Error: release v${version} not found` : 'Error: no releases found');
    process.exit(1);
  }

  if (config.default_author) {
    for (const section of Object.values(release.sections)) {
      for (const item of section.items) {
        if (!item.author) item.author = config.default_author;
      }
    }
  }

  const outDir = resolve(cwd, config.output_dir || 'changelog');
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `digest-v${release.version}.html`);
  writeFileSync(outPath, renderDigest(release), 'utf-8');
  console.log(`Written ${config.output_dir}/digest-v${release.version}.html`);
}
