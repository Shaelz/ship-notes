import { loadConfig } from './config.js';
import { loadReleasesOrExit, applyDefaultAuthor } from './releases.js';
import { orderedSections, type Release } from '@ship-notes/core';

function isDiscordWebhook(webhook: string): boolean {
  return webhook.includes('discord.com');
}

// Slack bolds with *text*; Discord treats a single asterisk as italics and needs **text**.
export function formatSummary(release: Release, siteUrl: string, isDiscord: boolean): string {
  const bold = (text: string) => (isDiscord ? `**${text}**` : `*${text}*`);

  const title = release.name
    ? `v${release.version} — ${release.name}`
    : `v${release.version}`;

  const url = siteUrl ? `${siteUrl}/v/${release.version}` : '';
  const header = url ? `${bold(title)}  ${url}` : bold(title);

  const lines: string[] = [header, release.date];
  if (release.summary) lines.push('', release.summary);

  for (const { label, section } of orderedSections(release)) {
    lines.push('', bold(label));
    for (const item of section.items) {
      const breaking = item.breaking ? ' [breaking]' : '';
      lines.push(`• ${item.text}${breaking}`);
    }
  }

  return lines.join('\n');
}

async function send(webhook: string, text: string): Promise<void> {
  const isDiscord = isDiscordWebhook(webhook);
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

  const releases = loadReleasesOrExit(config, cwd);
  applyDefaultAuthor(releases, config);

  const version = versionArg?.replace(/^v/, '');
  const release = version ? releases.find((r) => r.version === version) : releases[0];
  if (!release) {
    console.error(version ? `Error: release v${version} not found` : 'Error: no releases found');
    process.exit(1);
  }

  const text = formatSummary(release, config.url, isDiscordWebhook(webhook));
  send(webhook, text).then(() => {
    console.log(`Notified: v${release.version}`);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
