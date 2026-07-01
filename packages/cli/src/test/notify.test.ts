import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Release } from '@ship-notes/core';
import { formatSummary } from '../notify.js';

const release: Release = {
  version: '1.0.0',
  date: '2026-06-30',
  name: 'Launch',
  sections: {
    new: { items: [{ text: 'Added a thing' }] },
  },
};

describe('formatSummary', () => {
  it('bolds with single asterisks for Slack', () => {
    const text = formatSummary(release, '', false);
    assert.match(text, /^\*v1\.0\.0 — Launch\*$/m);
    assert.match(text, /^\*New\*$/m);
  });

  it('bolds with double asterisks for Discord', () => {
    const text = formatSummary(release, '', true);
    assert.match(text, /^\*\*v1\.0\.0 — Launch\*\*$/m);
    assert.match(text, /^\*\*New\*\*$/m);
  });
});
