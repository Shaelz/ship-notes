import type { Release } from '../schema.js';
import { SECTION_DEFAULTS, SECTION_ORDER, type StandardSectionKey } from '../schema.js';

function e(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderDigest(release: Release): string {
  const title = release.name
    ? `v${release.version} — ${release.name}`
    : `v${release.version}`;

  const standardKeys = SECTION_ORDER.filter((k) => release.sections[k] !== undefined);
  const extraKeys = Object.keys(release.sections).filter(
    (k) => !SECTION_ORDER.includes(k as StandardSectionKey)
  );

  const sectionsHtml = [...standardKeys, ...extraKeys].map((key) => {
    const section = release.sections[key];
    if (!section) return '';
    const label = section.label ?? SECTION_DEFAULTS[key as StandardSectionKey] ?? key;

    const items = section.items.map((item) => {
      const breaking = item.breaking ? ' <strong>[breaking]</strong>' : '';
      const link = item.link ? ` <a href="${e(item.link)}">#</a>` : '';
      const author = item.author ? ` — ${item.author}` : '';
      return `      <li style="margin:0.4em 0;">${e(item.text)}${breaking}${link}${author}</li>`;
    }).join('\n');

    return `
    <tr><td style="padding-top:1.5em;">
      <p style="margin:0 0 0.4em;font-size:0.7em;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#888;">${e(label)}</p>
      <ul style="margin:0;padding-left:1.25em;font-size:0.9em;line-height:1.6;color:#333;">
${items}
      </ul>
    </td></tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${e(title)}</title></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:monospace;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:2em 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#faf7f0;border:1px solid #ccc;padding:2em 2.5em;">
        <tr><td style="border-bottom:2px solid #333;padding-bottom:1em;margin-bottom:1em;">
          <h1 style="margin:0;font-size:1.8em;font-weight:700;letter-spacing:-0.02em;">${e(title)}</h1>
          <p style="margin:0.25em 0 0;font-size:0.75em;color:#888;">${e(release.date)}</p>
        </td></tr>
        ${release.summary ? `<tr><td style="padding-top:1em;font-size:0.9em;line-height:1.7;color:#555;border-left:3px solid #333;padding-left:1em;">${e(release.summary)}</td></tr>` : ''}
        ${sectionsHtml}
      </table>
    </td></tr>
  </table>
</body>
</html>
`;
}
