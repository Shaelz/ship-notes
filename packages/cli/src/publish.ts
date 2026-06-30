import { readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { parseReleaseFile, ParseError } from './parse.js';
import { renderChangelog } from './render/markdown.js';
import { compareSemver } from './semver.js';
import { loadConfig } from './config.js';

function parseGithubRepo(repoUrl: string): { owner: string; repo: string } | null {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (!match) return null;
  return { owner: match[1]!, repo: match[2]! };
}

async function publishToGithub(versionArg?: string): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('Error: GITHUB_TOKEN environment variable is not set');
    process.exit(1);
  }

  const cwd = process.cwd();
  const config = loadConfig(cwd);

  if (!config.repo) {
    console.error('Error: set repo in ship-notes.toml before publishing to GitHub');
    process.exit(1);
  }

  const parsed = parseGithubRepo(config.repo);
  if (!parsed) {
    console.error(`Error: repo must be a GitHub URL (got ${config.repo})`);
    process.exit(1);
  }

  const releasesDir = resolve(cwd, config.releases_dir || 'releases');
  let files: string[];
  try {
    files = readdirSync(releasesDir).filter((f) => f.endsWith('.toml'));
  } catch {
    console.error('Error: no releases/ directory found.');
    process.exit(1);
  }

  const releases = [];
  for (const file of files) {
    try {
      releases.push(parseReleaseFile(join(releasesDir, file)));
    } catch (err) {
      if (err instanceof ParseError) { console.error(err.message); process.exit(1); }
      throw err;
    }
  }
  releases.sort((a, b) => compareSemver(a.version, b.version));

  if (config.default_author) {
    for (const release of releases) {
      for (const section of Object.values(release.sections)) {
        for (const item of section.items) {
          if (!item.author) item.author = config.default_author;
        }
      }
    }
  }

  const version = versionArg?.replace(/^v/, '');
  const release = version ? releases.find((r) => r.version === version) : releases[0];
  if (!release) {
    console.error(version ? `Error: release v${version} not found` : 'Error: no releases found');
    process.exit(1);
  }

  const body = renderChangelog([release]).replace(/^# Changelog\n\n/, '');
  const name = release.name ? `v${release.version} — ${release.name}` : `v${release.version}`;

  const apiUrl = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/releases`;
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      tag_name: `v${release.version}`,
      name,
      body,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Error: GitHub API returned ${res.status} — ${text}`);
    process.exit(1);
  }

  const data = await res.json() as { html_url: string };
  console.log(`Published: ${data.html_url}`);
}

export function publish(flags: string[], versionArg?: string): void {
  if (flags.includes('--github')) {
    publishToGithub(versionArg).catch((err) => { console.error(err); process.exit(1); });
    return;
  }
  console.error('Usage: ship-notes publish --github [<version>]');
  process.exit(1);
}
