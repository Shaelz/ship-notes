import { redirect } from '@sveltejs/kit';
import { loadReleases } from '$lib/releases.server';

export const prerender = true;

export function load() {
  const releases = loadReleases();
  if (releases.length === 0) return {};
  redirect(302, `/v/${releases[0]!.version}`);
}
