import { loadSiteConfig } from '$lib/releases.server';

export const prerender = true;

export function GET() {
  const config = loadSiteConfig();

  const lines = ['User-agent: *', 'Allow: /'];
  if (config.url) lines.push('', `Sitemap: ${config.url}/sitemap.xml`);

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
