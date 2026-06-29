import { readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { parse as parseTOML } from 'smol-toml';
import { z } from 'zod';
import type { Release } from './types';

const Item = z.object({
  text: z.string().min(1),
  link: z.string().url().optional(),
  breaking: z.boolean().optional()
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

export function loadReleases(releasesDir?: string): Release[] {
  const dir = releasesDir ?? resolve(process.cwd(), '../../releases');
  const files = readdirSync(dir).filter((f) => f.endsWith('.toml'));

  const releases: Release[] = [];
  for (const file of files) {
    const raw = readFileSync(join(dir, file), 'utf-8');
    const parsed = parseTOML(raw);
    const result = ReleaseSchema.safeParse(parsed);
    if (result.success) releases.push(result.data);
  }

  return releases.sort((a, b) => compareSemver(a.version, b.version));
}
