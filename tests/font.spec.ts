import { test, expect } from '@playwright/test';
import coverage from '../scripts/font-coverage.json' with { type: 'json' };

test('game font retains every included glyph raster and never fetches the source font during play', async ({ page, context }) => {
  const requests: string[] = [];
  page.on('request', r => requests.push(r.url()));
  await page.goto('./');
  await page.evaluate(async () => { await document.fonts.ready; await navigator.serviceWorker.ready; });
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  expect(requests.some(url => url.endsWith('/fonts/wenkai-game.woff2'))).toBe(true);
  expect(requests.some(url => url.endsWith('/fonts/wenkai.woff2'))).toBe(false);
  const mismatch = await page.evaluate(async ({ characters, originalUnsupported }) => {
    // Explicitly load the preserved reference only inside this regression test.
    const original = new FontFace('ReferenceWenKai', 'url("./fonts/wenkai.woff2")');
    document.fonts.add(await original.load());
    const canvas = document.createElement('canvas');
    canvas.width = 1100; canvas.height = 80;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const raster = (family: string, text: string, size: number, weight: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${weight} ${size}px ${family}, serif`;
      ctx.fillText(text, 4, 60);
      return { width: ctx.measureText(text).width, pixels: ctx.getImageData(0, 0, canvas.width, canvas.height).data };
    };
    const chars = [...characters, ...originalUnsupported];
    for (const [size, weight] of [[18, 400], [47, 700]]) {
      for (let i = 0; i < chars.length; i += 20) {
        const text = chars.slice(i, i + 20).join('');
        const a = raster('ReferenceWenKai', text, size, weight), b = raster('WenKai', text, size, weight);
        if (a.width !== b.width || a.pixels.some((v, n) => v !== b.pixels[n])) return { text, size, weight };
      }
    }
    return null;
  }, coverage);
  expect(mismatch).toBeNull();
  const manifest = await page.evaluate(async () => {
    const name = (await caches.keys()).find(n => n.endsWith('-' + encodeURIComponent(location.pathname)))!;
    return (await (await caches.open(name)).keys()).map(r => new URL(r.url).pathname);
  });
  expect(manifest.some(p => p.endsWith('/fonts/wenkai-game.woff2'))).toBe(true);
  expect(manifest.some(p => p.endsWith('/fonts/wenkai.woff2'))).toBe(false);
  await context.setOffline(true);
  await page.reload();
  await page.setViewportSize({ width: 320, height: 740 });
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => [...document.fonts].some(f => f.family === 'WenKai' && f.status === 'loaded'))).toBe(true);
  await page.getByRole('button', { name: '批示回复', exact: true }).click();
  await page.locator('[data-choice="2"]').click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('dear-mayor:save:v1') ?? 'null')?.history.length)).toBe(1);
});
