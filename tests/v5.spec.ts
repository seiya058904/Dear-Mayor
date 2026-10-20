import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { currentDocument, decide, newGame } from '../src/game/engine';
import pilot from '../src/game/causal-pilot.json' with { type: 'json' };

const key = 'dear-mayor:save:v1';
for (const viewport of [
  { width: 1920, height: 1080 },
  { width: 1600, height: 1000 },
  { width: 2560, height: 1080 },
  { width: 1000, height: 800 },
  { width: 390, height: 844 },
]) test(`V5 visual assets and layout at ${viewport.width}x${viewport.height}`, async ({ page, request }) => {
  await page.setViewportSize(viewport);
  await page.goto('./');
  await page.evaluate(() => document.fonts.ready);
  for (const name of ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'site.webmanifest']) {
    const response = await request.get(new URL(name, page.url()).toString());
    expect(response.ok(), name).toBe(true);
  }
  const icon = await page.locator('link[rel="icon"]').getAttribute('href');
  expect(icon).toBeTruthy();
  expect((await request.get(new URL(icon!, page.url()).toString())).ok()).toBe(true);
  const geometry = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    inner: innerWidth,
    background: getComputedStyle(document.querySelector('.viewport-background')!).backgroundImage,
    scene: document.querySelector('.scene')!.getBoundingClientRect().toJSON(),
    paper: document.querySelector('.paper-art')!.getBoundingClientRect().toJSON(),
  }));
  expect(geometry.scroll).toBeLessThanOrEqual(geometry.inner);
  if (viewport.width > 720) {
    expect(geometry.background).toContain('background-wide.webp');
    expect(geometry.scene.width / geometry.scene.height).toBeCloseTo(1672 / 941, 2);
    expect(geometry.paper.width / geometry.paper.height).toBeCloseTo(1155 / 721, 2);
  }
  if (process.env.QA_SCREENSHOTS) {
    mkdirSync(process.env.QA_SCREENSHOTS, { recursive: true });
    await page.screenshot({ path: path.join(process.env.QA_SCREENSHOTS, `v5-${viewport.width}x${viewport.height}.png`), fullPage: true });
  }
});

for (const entry of pilot) test(`V5 browser save, reload and offline echo: ${entry.target}`, async ({ page, context }) => {
  let state = newGame();
  while (state.current !== entry.target) state = decide(state, state.current, 'approve');
  const expected = currentDocument(state);
  await page.goto('./');
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key, raw: JSON.stringify(state) });
  await page.reload();
  await expect(page.locator('article')).toHaveAttribute('data-letter-id', entry.target);
  await expect(page.locator('.letter-reading')).toContainText(entry.variants[0].draft);
  if (process.env.QA_SCREENSHOTS) {
    mkdirSync(process.env.QA_SCREENSHOTS, { recursive: true });
    await page.waitForTimeout(650);
    await page.screenshot({ path: path.join(process.env.QA_SCREENSHOTS, `v5-${entry.target.replace('/', '-')}.png`), fullPage: true });
  }
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  const cached = await page.evaluate(async () => {
    const names = await caches.keys();
    return (await Promise.all(names.filter(name => name.startsWith('dear-mayor-')).map(async name =>
      (await (await caches.open(name)).keys()).map(request => request.url)))).flat();
  });
  for (const asset of ['art/background-wide.webp', 'favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'site.webmanifest'])
    expect(cached.some(url => url.endsWith(asset)), asset).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('.letter-reading')).toContainText(entry.variants[0].draft);
  await page.getByRole('button', { name: '批示回复', exact: true }).click();
  await expect(page.locator('[data-choice]')).toHaveCount(3);
  await page.keyboard.press('Escape');
  await expect(page.locator('.letter-reading')).toContainText(expected.body[0]);
  await page.getByRole('button', { name: '批准', exact: true }).click();
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key)!).history.at(-1).result, key)).toBe(expected.results.approve);
});
