import type { Release } from "./schema.js";

export interface AuthorDefaults {
  default_author?: string | undefined;
  default_author_url?: string | undefined;
}

// Mutates items in place — callers pass releases they own, not shared/cached data.
export function applyDefaultAuthor(releases: Release[], defaults: AuthorDefaults): void {
  if (!defaults.default_author) return;
  for (const release of releases) {
    for (const section of Object.values(release.sections)) {
      for (const item of section.items) {
        if (!item.author) item.author = defaults.default_author;
        if (!item.author_url && defaults.default_author_url) item.author_url = defaults.default_author_url;
      }
    }
  }
}
