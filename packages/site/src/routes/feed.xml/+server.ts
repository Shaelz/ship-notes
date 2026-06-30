import { loadReleases, loadSiteConfig } from '$lib/releases.server';
import { orderedSections } from '$lib/types';

export const prerender = true;

function escape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function releaseDescription(release: ReturnType<typeof loadReleases>[number]): string {
  const parts: string[] = [];
  if (release.summary) parts.push(`<p>${escape(release.summary)}</p>`);

  for (const { label, section } of orderedSections(release)) {
    parts.push(`<h3>${escape(label)}</h3><ul>`);
    for (const item of section.items) {
      const breaking = item.breaking ? ' [BREAKING]' : '';
      const link = item.link ? ` <a href="${escape(item.link)}">#</a>` : '';
      parts.push(`<li>${escape(item.text)}${breaking}${link}</li>`);
    }
    parts.push('</ul>');
  }

  return parts.join('\n');
}

export function GET() {
  const config = loadSiteConfig();
  const releases = loadReleases(config);
  const siteUrl = config.url ?? 'https://example.com';
  const title = config.title ?? 'Releases';

  const items = releases.map((release) => {
    const releaseTitle = release.name
      ? `v${release.version} — ${release.name}`
      : `v${release.version}`;

    return `
    <item>
      <title>${escape(releaseTitle)}</title>
      <link>${escape(siteUrl)}/v/${escape(release.version)}</link>
      <guid isPermaLink="true">${escape(siteUrl)}/v/${escape(release.version)}</guid>
      <pubDate>${new Date(release.date).toUTCString()}</pubDate>
      <description><![CDATA[${releaseDescription(release)}]]></description>
    </item>`.trim();
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(title)}</title>
    <link>${escape(siteUrl)}</link>
    <description>Release notes</description>
    <atom:link href="${escape(siteUrl)}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items.join('\n    ')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'max-age=3600'
    }
  });
}
