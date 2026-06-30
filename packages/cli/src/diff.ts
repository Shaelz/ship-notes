import { readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { parseReleaseFile, ParseError } from './parse.js';
import { renderChangelog } from './render/markdown.js';
import { compareSemver } from './semver.js';
import { loadConfig } from './config.js';

function loadAllReleases(releasesDir: string) {
  const files = readdirSync(releasesDir).filter((f) => f.endsWith('.toml'));
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
  return releases.sort((a, b) => compareSemver(a.version, b.version));
}

export function diff(arg?: string): void {
  const cwd = process.cwd();
  const config = loadConfig(cwd);
  const releasesDir = resolve(cwd, config.releases_dir || 'releases');

  let files: string[];
  try {
    files = readdirSync(releasesDir).filter((f) => f.endsWith('.toml'));
  } catch {
    console.error(`Error: no releases/ directory found.`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.error(`Error: no .toml files found in releases/`);
    process.exit(1);
  }

  const all = loadAllReleases(releasesDir);

  if (config.default_author) {
    for (const release of all) {
      for (const section of Object.values(release.sections)) {
        for (const item of section.items) {
          if (!item.author) item.author = config.default_author;
        }
      }
    }
  }

  // no arg — show latest release
  if (!arg) {
    if (!all[0]) { console.error('Error: no releases found'); process.exit(1); }
    process.stdout.write(renderChangelog([all[0]]));
    return;
  }

  // range: v1.0.0..v1.2.0
  const rangeMatch = arg.match(/^v?([\d.]+)\.\.v?([\d.]+)$/);
  if (rangeMatch) {
    const from = rangeMatch[1]!;
    const to = rangeMatch[2]!;
    const slice = all.filter((r) => compareSemver(r.version, from) <= 0 && compareSemver(r.version, to) >= 0);
    if (slice.length === 0) {
      console.error(`Error: no releases found in range ${arg}`);
      process.exit(1);
    }
    process.stdout.write(renderChangelog(slice));
    return;
  }

  // single version
  const version = arg.replace(/^v/, '');
  const release = all.find((r) => r.version === version);
  if (!release) {
    console.error(`Error: release v${version} not found`);
    process.exit(1);
  }
  process.stdout.write(renderChangelog([release]));
}
