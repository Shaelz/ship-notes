import type { Release } from "../schema.js";
import {
  SECTION_DEFAULTS,
  SECTION_ORDER,
  type StandardSectionKey,
} from "../schema.js";

function renderRelease(release: Release): string {
  const lines: string[] = [];

  const title = release.name
    ? `## v${release.version} — ${release.name}`
    : `## v${release.version}`;
  lines.push(title);
  lines.push(`*${release.date}*`);

  if (release.summary) {
    lines.push("");
    lines.push(release.summary);
  }

  const standardKeys = SECTION_ORDER.filter(
    (k) => release.sections[k] !== undefined
  );
  const extraKeys = Object.keys(release.sections).filter(
    (k) => !SECTION_ORDER.includes(k as StandardSectionKey)
  );
  const orderedKeys = [...standardKeys, ...extraKeys];

  for (const key of orderedKeys) {
    const section = release.sections[key];
    if (!section) continue;

    const label =
      section.label ??
      SECTION_DEFAULTS[key as StandardSectionKey] ??
      key;

    lines.push("");
    lines.push(`### ${label}`);
    lines.push("");

    for (const item of section.items) {
      const breaking = item.breaking ? " **[breaking]**" : "";
      const link = item.link ? ` ([#](${item.link}))` : "";
      lines.push(`- ${item.text}${breaking}${link}`);
    }
  }

  return lines.join("\n");
}

export function renderChangelog(releases: Release[]): string {
  const sections = releases.map(renderRelease);
  return ["# Changelog", "", ...sections].join("\n\n") + "\n";
}
