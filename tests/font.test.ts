import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import coverage from '../scripts/font-coverage.json' with { type: 'json' };

test('web font covers every current, frozen and UI source character without new fallback', () => {
  const inventory = JSON.parse(execFileSync(process.execPath, ['scripts/font-characters.mjs'], { encoding: 'utf8' })) as { codepoints: number[] };
  const supported = new Set([...coverage.characters].map(c => c.codePointAt(0)));
  const previousFallback = new Set([...coverage.originalUnsupported].map(c => c.codePointAt(0)));
  const missing = inventory.codepoints.filter(cp => !supported.has(cp) && !previousFallback.has(cp));
  assert.deepEqual(missing.map(cp => `U+${cp.toString(16)} ${String.fromCodePoint(cp)}`), [],
    'New characters need a regenerated font: see scripts/subset-font.py');
  assert.equal(coverage.outlinesMetricsAndHintsEqual, true);
});

test('verified font bytes, preload and stylesheet stay paired', () => {
  const hash = (file: string) => createHash('sha256').update(readFileSync(file)).digest('hex');
  assert.equal(hash('public/fonts/wenkai.woff2'), coverage.sourceSHA256);
  assert.equal(hash('public/fonts/wenkai-game.woff2'), coverage.subsetSHA256);
  for (const file of ['index.html', 'src/styles.css']) {
    const text = readFileSync(file, 'utf8');
    assert.match(text, /fonts\/wenkai-game\.woff2/);
    assert.doesNotMatch(text, /fonts\/wenkai\.woff2/);
  }
  assert.match(readFileSync('public/fonts/OFL.txt', 'utf8'), /solely for web font delivery/);
});
