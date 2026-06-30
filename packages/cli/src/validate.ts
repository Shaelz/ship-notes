import { readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { parseReleaseFile, ParseError } from './parse.js';
import { loadConfig } from './config.js';

export function validate(): void {
  const cwd = process.cwd();
  const config = loadConfig(cwd);
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

  let errors = 0;
  for (const file of files) {
    try {
      parseReleaseFile(join(releasesDir, file));
    } catch (err) {
      if (err instanceof ParseError) {
        console.error(err.message);
        errors++;
      } else {
        throw err;
      }
    }
  }

  if (errors > 0) {
    console.error(`\n${errors} file(s) failed validation`);
    process.exit(1);
  }

  console.log(`✓ ${files.length} release file(s) valid`);
}
