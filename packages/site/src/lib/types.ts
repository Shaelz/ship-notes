export type ReleaseItem = {
  text: string;
  link?: string;
  breaking?: boolean;
  author?: string;
};

export type ReleaseSection = {
  label?: string;
  items: ReleaseItem[];
};

export type Release = {
  version: string;
  date: string;
  name?: string;
  summary?: string;
  sections: Record<string, ReleaseSection>;
};

export const SECTION_ORDER = ['new', 'fixed', 'changed', 'removed'] as const;

export const SECTION_DEFAULTS: Record<string, string> = {
  new: 'New',
  fixed: 'Fixed',
  changed: 'Changed',
  removed: 'Removed'
};

export function orderedSections(release: Release): Array<{ key: string; label: string; section: ReleaseSection }> {
  const standardKeys = SECTION_ORDER.filter((k) => release.sections[k] !== undefined);
  const extraKeys = Object.keys(release.sections).filter(
    (k) => !(SECTION_ORDER as readonly string[]).includes(k)
  );

  return [...standardKeys, ...extraKeys].map((key) => ({
    key,
    label: release.sections[key]?.label ?? SECTION_DEFAULTS[key] ?? key,
    section: release.sections[key]!
  }));
}
