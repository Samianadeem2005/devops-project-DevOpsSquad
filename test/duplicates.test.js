// test/duplicates.test.js — unit tests for duplicate page detection
const { test } = require('node:test');
const assert = require('node:assert');
const { isDuplicate } = require('../tools/duplicates');

test('pages with different titles are not duplicates', () => {
  assert.strictEqual(isDuplicate({ title: 'Intro' }, { title: 'Notes' }), false);
});

test('pages with matching titles are duplicates', () => {
  assert.strictEqual(isDuplicate({ title: 'Overview' }, { title: 'Overview' }), true);
});

test('missing arguments return false', () => {
  assert.strictEqual(isDuplicate(null, { title: 'Overview' }), false);
  assert.strictEqual(isDuplicate({ title: 'Overview' }, null), false);
});
