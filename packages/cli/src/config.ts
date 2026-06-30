import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse as parseTOML } from 'smol-toml';
import { z } from 'zod';

const ConfigSchema = z.object({
  title: z.string().optional(),
  url: z.string().url('url must be a valid URL').optional(),
  repo: z.string().url('repo must be a valid URL').optional(),
  releases_dir: z.string().optional(),
  output_dir: z.string().optional(),
  default_author: z.string().optional(),
  default_author_url: z.string().url('default_author_url must be a valid URL').optional(),
  notify_webhook: z.string().url('notify_webhook must be a valid URL').optional(),
});

export type Config = z.infer<typeof ConfigSchema>;

export type ResolvedConfig = { [K in keyof Config]-?: NonNullable<Config[K]> };

const DEFAULTS: ResolvedConfig = {
  title: 'Releases',
  url: 'https://example.com',
  repo: '',
  releases_dir: 'releases',
  output_dir: 'changelog',
  default_author: '',
  default_author_url: '',
  notify_webhook: '',
};

export function loadConfig(cwd: string = process.cwd()): ResolvedConfig {
  const configPath = resolve(cwd, 'ship-notes.toml');
  if (!existsSync(configPath)) return DEFAULTS;

  const raw = readFileSync(configPath, 'utf-8');
  const parsed = parseTOML(raw);
  const result = ConfigSchema.safeParse(parsed);

  if (!result.success) {
    const issues = result.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
    console.warn(`ship-notes.toml has invalid fields (using defaults):\n${issues}`);
    return DEFAULTS;
  }

  return { ...DEFAULTS, ...result.data } as ResolvedConfig;
}
