/** Secondary runtime audit. Engine/content sources are unchanged; mount timing differs. */
import { spawn } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { chromium, expect } from '@playwright/test';
import { newGame, decide } from '../src/game/engine';
import { restore } from '../src/game/persistence';
const out = '.local/performance-20261023', key = 'dear-mayor:save:v1';
function jsHash(dir: string) {
  const file = readdirSync(dir + '/assets').find(f => f.endsWith('.js'))!;
  return createHash('sha256').update(readFileSync(`${dir}/assets/${file}`)).digest('hex');
}
const appJSHashes = { before: jsHash(out + '/baseline-dist'), after: jsHash('dist') };
const nodeRows = [];
for (let sample = 0; sample < 5; sample++) for (const count of [100, 1000]) {
  let state = newGame(), start = performance.now();
  for (let i = 0; i < count; i++) state = decide(state, state.current, ['approve', 'reject', 'defer', 'written_reply'][i % 4] as any, i % 3);
  const decisionsMs = performance.now() - start, raw = JSON.stringify(state);
  start = performance.now(); expect(restore(raw)).toEqual(state);
  nodeRows.push({ sample, count, decisionsMs, restoreMs: performance.now() - start, bytes: Buffer.byteLength(raw) });
}
let long = newGame();
for (let i = 0; i < 1000; i++) long = decide(long, long.current, 'approve');
const browser = await chromium.launch(), rows: any[] = [];
try {
  for (let sample = 0; sample < 5; sample++) for (const phase of (sample % 2 ? ['after', 'before'] : ['before', 'after'])) {
    const server = spawn(process.execPath, ['scripts/serve-production.mjs'], {
      env: { ...process.env, PORT: '53534', DIST_DIR: phase === 'before' ? out + '/baseline-dist' : 'dist' },
      windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
    });
    const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
    try {
      await new Promise<void>((r, reject) => { server.stdout.once('data', () => r()); server.once('error', reject); server.once('exit', code => reject(Error(`Server exit ${code}`))); });
      const page = await context.newPage(), cdp = await context.newCDPSession(page);
      await page.goto('http://127.0.0.1:53534/');
      await page.evaluate(async () => { await navigator.serviceWorker.ready; await document.fonts.ready; });
      await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key, raw: JSON.stringify(long) });
      const start = performance.now(); await page.reload();
      await expect(page.locator('article')).toHaveAttribute('data-letter-id', long.current);
      const restoreMs = performance.now() - start;
      const replyStart = performance.now(); await page.getByRole('button', { name: '批示回复', exact: true }).click();
      await expect(page.locator('[data-choice]')).toHaveCount(3);
      const replyMs = performance.now() - replyStart;
      await page.keyboard.press('Escape');
      const row: any = { phase, sample, restoreMs, replyMs };
      // One full UI flow per version; the 25ms reduced-motion transition is
      // intentionally retained. Separate synchronous handlers from paced time.
      if (sample === 0) {
        await page.evaluate(key => localStorage.removeItem(key), key); await page.reload();
        row.flow = await page.evaluate(async key => {
          const handlers: number[] = [], start = performance.now(); let first100Ms = 0;
          for (let i = 0; i < 1000; i++) {
            const t = performance.now(); (document.querySelector('.decision') as HTMLButtonElement).click();
            handlers.push(performance.now() - t);
            if (JSON.parse(localStorage.getItem(key)!).history.length !== i + 1) throw Error(`Missed decision ${i}`);
            await new Promise(r => setTimeout(r, 35));
            while ((document.querySelector('.decision') as HTMLButtonElement).disabled) await new Promise(r => setTimeout(r, 5));
            if (i === 99) first100Ms = performance.now() - start;
          }
          return { first100Ms, total1000Ms: performance.now() - start, handlers };
        }, key);
        await context.setOffline(true); await page.reload();
        expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).history.length, key)).toBe(1000);
        await expect(page.locator('.save-warning')).toHaveCount(0);
      }
      rows.push(row); console.log(JSON.stringify({ ...row, flow: row.flow ? '1000 UI decisions PASS' : undefined }));
    } finally {
      await context.close(); const exited = new Promise<void>(r => server.once('exit', () => r())); server.kill(); await exited;
    }
  }
  writeFileSync(out + '/runtime.json', JSON.stringify({ node: process.version, browser: browser.version(), appJSHashes, engineSourcesUnchanged: true, nodeRows, rows }, null, 2));
} finally { await browser.close(); }
