import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ReleaseSchema } from '../schema.js';

const validRelease = {
  version: '1.0.0',
  date: '2026-06-30',
  sections: {
    new: { items: [{ text: 'Initial release' }] },
  },
};

describe('ReleaseSchema', () => {
  it('accepts a minimal valid release', () => {
    const result = ReleaseSchema.safeParse(validRelease);
    assert.equal(result.success, true);
  });

  it('accepts optional fields', () => {
    const result = ReleaseSchema.safeParse({
      ...validRelease,
      name: 'Launch',
      summary: 'First release.',
      sections: {
        new: { items: [{ text: 'Added X', link: 'https://github.com/a/b/commit/abc', author: 'Alice' }] },
        fixed: { items: [{ text: 'Fixed Y', breaking: true }] },
      },
    });
    assert.equal(result.success, true);
  });

  it('rejects a missing version', () => {
    const result = ReleaseSchema.safeParse({ ...validRelease, version: undefined });
    assert.equal(result.success, false);
  });

  it('rejects an invalid semver version', () => {
    const result = ReleaseSchema.safeParse({ ...validRelease, version: 'v1.0' });
    assert.equal(result.success, false);
  });

  it('rejects a malformed date', () => {
    const result = ReleaseSchema.safeParse({ ...validRelease, date: '30-06-2026' });
    assert.equal(result.success, false);
  });

  it('rejects an empty sections object', () => {
    const result = ReleaseSchema.safeParse({ ...validRelease, sections: {} });
    assert.equal(result.success, false);
  });

  it('rejects a section with no items', () => {
    const result = ReleaseSchema.safeParse({
      ...validRelease,
      sections: { new: { items: [] } },
    });
    assert.equal(result.success, false);
  });

  it('rejects an item with an invalid link URL', () => {
    const result = ReleaseSchema.safeParse({
      ...validRelease,
      sections: { new: { items: [{ text: 'Foo', link: 'not-a-url' }] } },
    });
    assert.equal(result.success, false);
  });

  it('rejects an item with empty text', () => {
    const result = ReleaseSchema.safeParse({
      ...validRelease,
      sections: { new: { items: [{ text: '' }] } },
    });
    assert.equal(result.success, false);
  });
});
