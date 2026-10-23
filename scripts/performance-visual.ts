/** Same browser, seed, viewport and decoded assets; baseline vs final production. */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium, expect } from '@playwright/test';
const out = '.local/performance-20261023';
const browser = await chromium.launch();
const rows: any[] = [];
try {
  for (const phase of ['before', 'after']) {
    const server = spawn(process.execPath, ['scripts/serve-production.mjs'], {
      env: { ...process.env, PORT: '53534', DIST_DIR: phase === 'before' ? out + '/baseline-dist' : 'dist' },
      windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
    });
    try {
      await new Promise<void>((resolve, reject) => {
        server.stdout.once('data', () => resolve());
        server.once('error', reject); server.once('exit', code => reject(Error(`Server exit ${code}`)));
      });
      for (const [width, height] of [[1672, 941], [1366, 768], [721, 1024], [390, 844], [320, 740], [1672, 640], [1920, 1080]]) {
        const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
        try {
          const page = await context.newPage(), errors: string[] = [];
          page.on('pageerror', e => errors.push(e.message));
          page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
          await page.goto('http://127.0.0.1:53534/Dear-Mayor/');
          await expect(page).toHaveTitle('Dear Mayor · 小镇，请批示');
          await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode())); });
          mkdirSync(out + '/visual', { recursive: true });
          for (const state of ['letter', 'reply']) {
            if (state === 'reply') {
              await page.getByRole('button', { name: '批示回复', exact: true }).click();
              await expect(page.locator('[data-choice]')).toHaveCount(3);
              // The note background is a CSS image; wait for its response too.
              await page.evaluate(async () => { const i = new Image(); i.src = './art/note.webp'; await i.decode(); });
            }
            await page.screenshot({ path: `${out}/visual/${phase}-${width}-${height}-${state}.png`, fullPage: true });
            const geometry = await page.evaluate(() => [...document.querySelectorAll('article,h1,.letter-reading,.signature,.decision,[data-choice]')].map(e => ({
              tag: e.tagName, text: e.textContent, box: e.getBoundingClientRect().toJSON(), font: getComputedStyle(e).font,
            })));
            rows.push({ phase, width, height, state, geometry, errors });
          }
          expect(errors).toEqual([]);
        } finally { await context.close(); }
      }
    } finally {
      const exited = new Promise<void>(r => server.once('exit', () => r()));
      server.kill(); await exited;
    }
  }
  for (const before of rows.filter(r => r.phase === 'before')) {
    const after = rows.find(r => r.phase === 'after' && r.width === before.width && r.height === before.height && r.state === before.state);
    expect(after.geometry).toEqual(before.geometry);
  }
  writeFileSync(out + '/visual/geometry.json', JSON.stringify(rows, null, 2));
  console.log(`${rows.length / 2} scene geometry pairs identical; ${rows.length} screenshots saved.`);
} finally { await browser.close(); }
