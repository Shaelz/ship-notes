import { loadReleases } from '$lib/releases.server';

export const prerender = true;

export function load() {
  const releases = loadReleases();
  if (releases.length === 0) return { release: null };
  return { release: releases[0] ?? null };
}
