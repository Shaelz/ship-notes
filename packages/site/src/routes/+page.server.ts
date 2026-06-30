import { loadReleases } from '$lib/releases.server';

export const prerender = true;

export function load() {
  const releases = loadReleases();
  return { release: releases[0] ?? null };
}
