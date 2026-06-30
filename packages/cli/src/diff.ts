import { resolve } from 'node:path';
import { renderChangelog } from './render/markdown.js';
import { compareSemver } from './semver.js';
import { loadConfig } from './config.js';
import { loadReleasesOrExit, applyDefaultAuthor } from './releases.js';

export function diff(arg?: string): void {
  const cwd = process.cwd();
  const config = loadConfig(cwd);
  const releasesDir = resolve(cwd, config.releases_dir);
  const all = loadReleasesOrExit(releasesDir);
  applyDefaultAuthor(all, config);

  if (!arg) {
    if (!all[0]) { console.error('Error: no releases found'); process.exit(1); }
    process.stdout.write(renderChangelog([all[0]]));
    return;
  }

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

  const version = arg.replace(/^v/, '');
  const release = all.find((r) => r.version === version);
  if (!release) {
    console.error(`Error: release v${version} not found`);
    process.exit(1);
  }
  process.stdout.write(renderChangelog([release]));
}
