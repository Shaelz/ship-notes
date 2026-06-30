import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseReleaseFile, ParseError, compareSemver, type Release } from '@ship-notes/core';
import type { ResolvedConfig } from './config.js';

export function loadReleasesOrExit(releasesDir: string): Release[] {
  let files: string[];
  try {
    files = readdirSync(releasesDir).filter((f) => f.endsWith('.toml'));
  } catch {
    console.error(`Error: releases/ directory not found`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.error(`Error: no .toml files found in releases/`);
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

export function applyDefaultAuthor(releases: Release[], config: ResolvedConfig): void {
  if (!config.default_author) return;
  for (const release of releases) {
    for (const section of Object.values(release.sections)) {
      for (const item of section.items) {
        if (!item.author) item.author = config.default_author;
        if (!item.author_url && config.default_author_url) item.author_url = config.default_author_url;
      }
    }
  }
}
