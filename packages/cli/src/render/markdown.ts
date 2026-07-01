import { orderedSections, type Release } from "@ship-notes/core";

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

  for (const { label, section } of orderedSections(release)) {
    lines.push("");
    lines.push(`### ${label}`);
    lines.push("");

    for (const item of section.items) {
      const breaking = item.breaking ? " **[breaking]**" : "";
      const authorHref = item.author ? item.link ?? item.author_url : undefined;
      const author = item.author
        ? authorHref
          ? ` — [${item.author}](${authorHref})`
          : ` — ${item.author}`
        : "";
      // Only show the standalone reference marker when there's no author link to carry it.
      const link = !item.author && item.link ? ` ([#](${item.link}))` : "";
      lines.push(`- ${item.text}${breaking}${link}${author}`);
    }
  }

  return lines.join("\n");
}

export function renderChangelog(releases: Release[]): string {
  const sections = releases.map(renderRelease);
  return ["# Changelog", "", ...sections].join("\n\n") + "\n";
}
