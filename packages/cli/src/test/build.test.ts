import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseSinceFlag } from '../build.js';

describe('parseSinceFlag', () => {
  it('returns undefined when --since is not passed', () => {
    assert.equal(parseSinceFlag([]), undefined);
  });

  it('parses the space-separated form', () => {
    assert.equal(parseSinceFlag(['--since', '1.2.0']), '1.2.0');
  });

  it('parses the space-separated form with a v prefix', () => {
    assert.equal(parseSinceFlag(['--since', 'v1.2.0']), '1.2.0');
  });

  it('parses the --since= form', () => {
    assert.equal(parseSinceFlag(['--since=1.2.0']), '1.2.0');
  });

  it('parses the --since= form with a v prefix', () => {
    assert.equal(parseSinceFlag(['--since=v1.2.0']), '1.2.0');
  });
});
