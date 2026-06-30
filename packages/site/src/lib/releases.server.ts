import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { parse as parseTOML } from 'smol-toml';
import { z } from 'zod';
import type { Release } from './types';

const Item = z.object({
  text: z.string().min(1),
  link: z.string().url().optional(),
  breaking: z.boolean().optional(),
  author: z.string().optional(),
});

const Section = z.object({
  label: z.string().optional(),
  items: z.array(Item).min(1)
});

const ReleaseSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  name: z.string().optional(),
  summary: z.string().optional(),
  sections: z.record(z.string(), Section).refine(
    (s) => Object.keys(s).length > 0,
    'Release must have at least one section'
  )
});

const SiteConfigSchema = z.object({
  title: z.string().optional(),
  url: z.string().url().optional(),
  default_author: z.string().optional(),
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

function parseSemver(version: string): [number, number, number] {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) throw new Error(`Cannot parse version: ${version}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function compareSemver(a: string, b: string): number {
  const [aMaj, aMin, aPat] = parseSemver(a);
  const [bMaj, bMin, bPat] = parseSemver(b);
  if (aMaj !== bMaj) return bMaj - aMaj;
  if (aMin !== bMin) return bMin - aMin;
  return bPat - aPat;
}

export function loadReleases(config?: SiteConfig, releasesDir?: string): Release[] {
  const cfg = config ?? loadSiteConfig();
  const dir = releasesDir ?? resolve(REPO_ROOT, 'releases');
  const files = readdirSync(dir).filter((f) => f.endsWith('.toml'));

  const releases: Release[] = [];
  for (const file of files) {
    const raw = readFileSync(join(dir, file), 'utf-8');
    const parsed = parseTOML(raw);
    const result = ReleaseSchema.safeParse(parsed);
    if (!result.success) continue;
    const release = result.data;
    if (cfg.default_author) {
      for (const section of Object.values(release.sections)) {
        for (const item of section.items) {
          if (!item.author) item.author = cfg.default_author;
        }
      }
    }
    releases.push(release);
  }

  return releases.sort((a, b) => compareSemver(a.version, b.version));
}
