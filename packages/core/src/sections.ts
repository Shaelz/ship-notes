import { SECTION_ORDER, SECTION_DEFAULTS } from "./schema.js";
import type { Release, ReleaseSection } from "./schema.js";

export function orderedSections(
  release: Release
): Array<{ key: string; label: string; section: ReleaseSection }> {
  const standardKeys = SECTION_ORDER.filter((k) => release.sections[k] !== undefined);
  const extraKeys = Object.keys(release.sections).filter(
    (k) => !(SECTION_ORDER as readonly string[]).includes(k)
  );

  return [...standardKeys, ...extraKeys].map((key) => ({
    key,
    label: release.sections[key]?.label ?? SECTION_DEFAULTS[key as keyof typeof SECTION_DEFAULTS] ?? key,
    section: release.sections[key] as ReleaseSection,
  }));
}
