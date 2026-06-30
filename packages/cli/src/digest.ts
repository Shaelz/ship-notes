import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { renderDigest } from './render/html.js';
import { loadConfig } from './config.js';
import { loadReleasesOrExit, applyDefaultAuthor } from './releases.js';

export function digest(versionArg?: string): void {
  const cwd = process.cwd();
  const config = loadConfig(cwd);
  const releasesDir = resolve(cwd, config.releases_dir);
  const releases = loadReleasesOrExit(releasesDir);
  applyDefaultAuthor(releases, config);

  const version = versionArg?.replace(/^v/, '');
  const release = version
    ? releases.find((r) => r.version === version)
    : releases[0];

  if (!release) {
    console.error(version ? `Error: release v${version} not found` : 'Error: no releases found');
    process.exit(1);
  }

  const outDir = resolve(cwd, config.output_dir);
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, `digest-v${release.version}.html`);
  writeFileSync(outPath, renderDigest(release), 'utf-8');
  console.log(`Written ${config.output_dir}/digest-v${release.version}.html`);
}
