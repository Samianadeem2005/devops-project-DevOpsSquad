// test/build.test.js — runs on Node's built-in test runner. No test framework.
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');

const pages = fs.readdirSync('out').filter((f) => f.endsWith('.html'));

test('every source produced a page', () => {
  const sources = fs.readdirSync('src').filter((f) => f.endsWith('.md'));
  assert.strictEqual(pages.length, sources.length + 1);
});

test('every page is real HTML and not raw Markdown', () => {
  for (const p of pages) {
    const html = fs.readFileSync('out/' + p, 'utf8');
    assert.match(html, /^<!doctype html>/);
    assert.doesNotMatch(html, /^# /m);
  }
});

test('no page is empty (zero-byte build failure)', () => {
  assert.ok(pages.length > 0, 'no pages were built');
  for (const p of pages) {
    const stats = fs.statSync('out/' + p);
    assert.ok(stats.size > 0, `page ${p} is empty (0 bytes)`);
  }
});
