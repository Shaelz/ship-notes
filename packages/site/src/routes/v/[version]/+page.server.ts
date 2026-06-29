import { error } from '@sveltejs/kit';
import { loadReleases } from '$lib/releases.server';

export const prerender = true;

export function entries() {
  const releases = loadReleases();
  return releases.map((r) => ({ version: r.version }));
}

export function load({ params }: { params: { version: string } }) {
  const releases = loadReleases();
  const release = releases.find((r) => r.version === params.version);
  if (!release) error(404, `Release v${params.version} not found`);
  return { release };
}
