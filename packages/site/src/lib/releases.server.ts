import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { parse as parseTOML } from 'smol-toml';
import { z } from 'zod';
import { ReleaseSchema, compareSemver, applyDefaultAuthor } from '@ship-notes/core';
import type { Release } from '@ship-notes/core';

const SiteConfigSchema = z.object({
  title: z.string().optional(),
  url: z.string().url().optional(),
  default_author: z.string().optional(),
  default_author_url: z.string().url().optional(),
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;

function gitAuthorName(): string {
  try {
    return execSync('git config user.name', { encoding: 'utf-8' }).trim();
  } catch {
    return '';
  }
}

export const REPO_ROOT = resolve(process.cwd(), '../..');

export function loadSiteConfig(root: string = REPO_ROOT): SiteConfig {
  const configPath = resolve(root, 'ship-notes.toml');
  if (!existsSync(configPath)) return { default_author: gitAuthorName() };
  const parsed = parseTOML(readFileSync(configPath, 'utf-8'));
  const result = SiteConfigSchema.safeParse(parsed);
  if (!result.success) {
    console.warn('ship-notes.toml has invalid fields (using defaults)');
    return { default_author: gitAuthorName() };
  }
  return { ...result.data, default_author: result.data.default_author || gitAuthorName() };
}

export function loadReleases(config?: SiteConfig, releasesDir?: string): Release[] {
  const cfg = config ?? loadSiteConfig();
  const dir = releasesDir ?? resolve(REPO_ROOT, 'releases');
  const files = readdirSync(dir).filter((f) => f.endsWith('.toml'));

  const releases: Release[] = [];
  for (const file of files) {
    const raw = readFileSync(join(dir, file), 'utf-8');

    let parsed: unknown;
    try {
      parsed = parseTOML(raw);
    } catch (err) {
      console.warn(`Skipping ${file}: invalid TOML — ${err instanceof Error ? err.message : err}`);
      continue;
    }

    const result = ReleaseSchema.safeParse(parsed);
    if (!result.success) {
      console.warn(`Skipping ${file}: ${result.error.issues.map((i) => i.message).join(', ')}`);
      continue;
    }
    releases.push(result.data);
  }

  applyDefaultAuthor(releases, cfg);
  return releases.sort((a, b) => compareSemver(a.version, b.version));
}
