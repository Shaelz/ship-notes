import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Release, ReleaseItem } from '@ship-notes/core';
import { renderChangelog } from '../render/markdown.js';
import { renderDigest } from '../render/html.js';

function release(itemOverrides: Partial<ReleaseItem>): Release {
  return {
    version: '1.0.0',
    date: '2026-06-30',
    sections: {
      new: { items: [{ text: 'Added a thing', ...itemOverrides }] },
    },
  };
}

describe('renderChangelog author links', () => {
  it('links the author to author_url when there is no item link', () => {
    const md = renderChangelog([release({ author: 'Alice', author_url: 'https://example.com/alice' })]);
    assert.match(md, /— \[Alice\]\(https:\/\/example\.com\/alice\)/);
  });

  it('prefers the item link over author_url', () => {
    const md = renderChangelog([release({
      author: 'Alice',
      author_url: 'https://example.com/alice',
      link: 'https://example.com/commit/abc',
    })]);
    assert.match(md, /— \[Alice\]\(https:\/\/example\.com\/commit\/abc\)/);
    assert.ok(!md.includes('([#]'), 'should not also render a standalone reference marker');
  });

  it('renders the author as plain text when no href is available', () => {
    const md = renderChangelog([release({ author: 'Alice' })]);
    assert.match(md, /— Alice$/m);
  });
});

describe('renderDigest author links', () => {
  it('links the author to author_url when there is no item link', () => {
    const html = renderDigest(release({ author: 'Alice', author_url: 'https://example.com/alice' }));
    assert.match(html, /<a href="https:\/\/example\.com\/alice">Alice<\/a>/);
  });
});
