import { loadReleases, loadSiteConfig } from '$lib/releases.server';

export const prerender = true;

function escape(str: string): string {
  return str.replace(/&/g, '&amp;');
}

export function GET() {
  const config = loadSiteConfig();
  const releases = loadReleases(config);
  const siteUrl = config.url ?? 'https://example.com';

  const urls = [siteUrl, `${siteUrl}/about`, ...releases.map((r) => `${siteUrl}/v/${r.version}`)];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${escape(u)}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'max-age=3600'
    }
  });
}
