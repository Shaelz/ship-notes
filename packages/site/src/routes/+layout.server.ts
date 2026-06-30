import { loadReleases, loadSiteConfig } from '$lib/releases.server';

export const prerender = true;

export function load() {
  const config = loadSiteConfig();
  const releases = loadReleases(config);
  return {
    releases: releases.map((r) => ({
      version: r.version,
      name: r.name,
      date: r.date
    })),
    siteTitle: config.title ?? 'Releases',
    siteUrl: config.url ?? ''
  };
}
