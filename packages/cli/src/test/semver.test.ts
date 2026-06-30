import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseSemver, compareSemver } from '@ship-notes/core';

describe('parseSemver', () => {
  it('parses a standard version', () => {
    assert.deepEqual(parseSemver('1.2.3'), [1, 2, 3]);
  });

  it('parses a version with pre-release suffix', () => {
    assert.deepEqual(parseSemver('2.0.0-beta.1'), [2, 0, 0]);
  });

  it('throws on invalid input', () => {
    assert.throws(() => parseSemver('not-a-version'), /Cannot parse version/);
  });
});

describe('compareSemver', () => {
  it('sorts descending by major', () => {
    const versions = ['1.0.0', '3.0.0', '2.0.0'];
    assert.deepEqual(versions.sort(compareSemver), ['3.0.0', '2.0.0', '1.0.0']);
  });

  it('sorts descending by minor when major is equal', () => {
    const versions = ['1.1.0', '1.3.0', '1.2.0'];
    assert.deepEqual(versions.sort(compareSemver), ['1.3.0', '1.2.0', '1.1.0']);
  });

  it('sorts descending by patch when major and minor are equal', () => {
    const versions = ['1.0.1', '1.0.3', '1.0.2'];
    assert.deepEqual(versions.sort(compareSemver), ['1.0.3', '1.0.2', '1.0.1']);
  });

  it('returns latest as first element after sort', () => {
    const versions = ['0.2.0', '1.4.0', '1.0.0', '0.3.0'];
    assert.equal(versions.sort(compareSemver)[0], '1.4.0');
  });
});
