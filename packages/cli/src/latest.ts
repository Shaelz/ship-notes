import { readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { parseReleaseFile, ParseError } from './parse.js';
import { compareSemver } from './semver.js';
import { loadConfig } from './config.js';

export function latest(): void {
  const cwd = process.cwd();
  const config = loadConfig(cwd);
  const releasesDir = resolve(cwd, config.releases_dir || 'releases');

  let files: string[];
  try {
    files = readdirSync(releasesDir).filter((f) => f.endsWith('.toml'));
  } catch {
    console.error('Error: no releases/ directory found.');
    process.exit(1);
  }

  const versions: string[] = [];
  for (const file of files) {
    try {
      versions.push(parseReleaseFile(join(releasesDir, file)).version);
    } catch (err) {
      if (!(err instanceof ParseError)) throw err;
    }
  }

  if (versions.length === 0) {
    console.error('Error: no valid releases found.');
    process.exit(1);
  }

  process.stdout.write(versions.sort(compareSemver)[0] + '\n');
}
