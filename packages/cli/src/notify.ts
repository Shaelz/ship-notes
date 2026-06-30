import { readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { parseReleaseFile, ParseError } from './parse.js';
import { compareSemver } from './semver.js';
import { loadConfig } from './config.js';
import { SECTION_DEFAULTS, SECTION_ORDER, type StandardSectionKey } from './schema.js';

function formatSummary(release: ReturnType<typeof parseReleaseFile>, siteUrl: string): string {
  const title = release.name
    ? `v${release.version} — ${release.name}`
    : `v${release.version}`;

  const url = siteUrl ? `${siteUrl}/v/${release.version}` : '';
  const header = url ? `*${title}*  ${url}` : `*${title}*`;

  const standardKeys = SECTION_ORDER.filter((k) => release.sections[k] !== undefined);
  const extraKeys = Object.keys(release.sections).filter(
    (k) => !SECTION_ORDER.includes(k as StandardSectionKey)
  );

  const lines: string[] = [header, release.date];
  if (release.summary) lines.push('', release.summary);

  for (const key of [...standardKeys, ...extraKeys]) {
    const section = release.sections[key];
    if (!section) continue;
    const label = section.label ?? SECTION_DEFAULTS[key as StandardSectionKey] ?? key;
    lines.push('', `*${label}*`);
    for (const item of section.items) {
      const breaking = item.breaking ? ' [breaking]' : '';
      lines.push(`• ${item.text}${breaking}`);
    }
  }

  return lines.join('\n');
}

async function send(webhook: string, text: string): Promise<void> {
  const isDiscord = webhook.includes('discord.com');
  const body = isDiscord ? { content: text } : { text };

  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const responseText = await res.text();
    console.error(`Error: webhook returned ${res.status} — ${responseText}`);
    process.exit(1);
  }
}

export function notify(versionArg?: string): void {
  const cwd = process.cwd();
  const config = loadConfig(cwd);

  const webhook = process.env.SHIP_NOTES_WEBHOOK || config.notify_webhook;
  if (!webhook) {
    console.error('Error: set notify_webhook in ship-notes.toml or SHIP_NOTES_WEBHOOK env var');
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

  const version = versionArg?.replace(/^v/, '');
  const release = version ? releases.find((r) => r.version === version) : releases[0];
  if (!release) {
    console.error(version ? `Error: release v${version} not found` : 'Error: no releases found');
    process.exit(1);
  }

  const text = formatSummary(release, config.url || '');
  send(webhook, text).then(() => {
    console.log(`Notified: v${release.version}`);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
