import type { Release } from '@ship-notes/core';

export function releaseTitle(release: Release): string {
  return release.name ? `v${release.version} — ${release.name}` : `v${release.version}`;
}

export function releaseDescription(release: Release): string {
  return release.summary ?? `Release notes for v${release.version}.`;
}
