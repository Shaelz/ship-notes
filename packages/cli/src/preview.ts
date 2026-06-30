import { spawn } from 'node:child_process';
import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';

export function preview(): void {
  const cwd = process.cwd();

  let siteDir: string | null = null;
  let dir = cwd;
  for (let i = 0; i < 5; i++) {
    const candidate = join(dir, 'packages', 'site');
    if (existsSync(join(candidate, 'package.json'))) {
      siteDir = candidate;
      break;
    }
    const parent = resolve(dir, '..');
    if (parent === dir) break;
    dir = parent;
  }

  if (!siteDir) {
    console.error('Error: could not find packages/site. Run ship-notes preview from your project root.');
    process.exit(1);
  }

  console.log('Starting preview server…');

  const child = spawn('pnpm', ['dev'], {
    cwd: siteDir,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  child.on('error', (err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });

  child.on('exit', (code) => {
    if (code !== 0 && code !== null) process.exit(code);
  });
}
