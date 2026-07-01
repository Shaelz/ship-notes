import { readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { parseReleaseFile, ParseError, compareSemver, applyDefaultAuthor, type Release } from '@ship-notes/core';
import type { ResolvedConfig } from './config.js';

export { applyDefaultAuthor };

export function loadReleasesOrExit(config: ResolvedConfig, cwd: string): Release[] {
  const releasesDir = resolve(cwd, config.releases_dir);

  let files: string[];
  try {
    files = readdirSync(releasesDir).filter((f) => f.endsWith('.toml'));
  } catch {
    console.error(`Error: ${config.releases_dir}/ directory not found`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.error(`Error: no .toml files found in ${config.releases_dir}/`);
    process.exit(1);
  }

  const releases: Release[] = [];
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

  return releases.sort((a, b) => compareSemver(a.version, b.version));
}
