import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { execSync } from 'node:child_process';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

function gitValue(key: string): string {
  try {
    return execSync(`git config ${key}`, { encoding: 'utf-8' }).trim();
  } catch {
    return '';
  }
}

function ask(rl: readline.Interface, question: string, fallback: string): Promise<string> {
  const prompt = fallback ? `${question} (${fallback}): ` : `${question}: `;
  return rl.question(prompt).then((ans) => ans.trim() || fallback);
}

export async function init(): Promise<void> {
  const cwd = process.cwd();
  const configPath = resolve(cwd, 'ship-notes.toml');

  if (existsSync(configPath)) {
    console.error('Error: ship-notes.toml already exists');
    process.exit(1);
  }

  const rl = readline.createInterface({ input, output });

  const title = await ask(rl, 'Project title', '');
  const url = await ask(rl, 'Changelog URL', '');
  const repo = await ask(rl, 'Repository URL', gitValue('remote.origin.url'));
  const author = await ask(rl, 'Default author', gitValue('user.name'));

  rl.close();

  const lines = [`title = ${JSON.stringify(title)}`];
  if (url) lines.push(`url   = ${JSON.stringify(url)}`);
  if (repo) lines.push(`repo  = ${JSON.stringify(repo)}`);
  if (author) lines.push(``, `default_author = ${JSON.stringify(author)}`);
  lines.push(``, `# releases_dir = "releases"   # default`, `# output_dir   = "changelog"  # default`);

  writeFileSync(configPath, lines.join('\n') + '\n', 'utf-8');

  const releasesDir = resolve(cwd, 'releases');
  const createdReleases = !existsSync(releasesDir);
  if (createdReleases) {
    mkdirSync(releasesDir);
    writeFileSync(join(releasesDir, '.gitkeep'), '', 'utf-8');
  }

  console.log('');
  console.log('Created ship-notes.toml');
  if (createdReleases) console.log('Created releases/');
  console.log('');
  console.log('Next: ship-notes add 0.1.0');
}
