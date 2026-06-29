import { loadReleases } from '$lib/releases.server';

export const prerender = true;

export function load() {
  const releases = loadReleases();
  return {
    releases: releases.map((r) => ({
      version: r.version,
      name: r.name,
      date: r.date
    }))
  };
}
