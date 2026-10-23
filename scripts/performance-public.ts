/** One fresh public context per phase: observation, not CDN cold-cache control. */
import { chromium, expect } from '@playwright/test';
import { writeFileSync } from 'node:fs';
const phase = process.env.PERF_PHASE;
if (!['before', 'after'].includes(phase ?? '')) throw Error('PERF_PHASE=before/after required');
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2.75, reducedMotion: 'reduce' });
  const page = await context.newPage(), errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  await page.addInitScript(() => {
    (window as any).publicTiming = {};
    const observer = new MutationObserver(() => {
      if (document.querySelectorAll('.decision').length !== 4) return;
      (window as any).publicTiming.dom = performance.now();
      document.fonts.ready.then(() => { (window as any).publicTiming.fonts = performance.now(); });
      observer.disconnect();
    }); observer.observe(document, { childList: true, subtree: true });
    navigator.serviceWorker.ready.then(() => { (window as any).publicTiming.offline = performance.now(); });
  });
  await page.goto('https://seiya058904.github.io/Dear-Mayor/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await expect(page.locator('article')).toBeVisible({ timeout: 120000 });
  await page.waitForFunction(() => performance.getEntriesByName('first-contentful-paint').length > 0);
  await page.evaluate(async () => {
    await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode()));
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
  await page.getByRole('button', { name: '批准', exact: true }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('dear-mayor:save:v1')!).history.length)).toBe(1);
  const interactive = await page.evaluate(() => performance.now());
  await page.waitForFunction(() => !!navigator.serviceWorker.controller && Number.isFinite((window as any).publicTiming.fonts), {}, { timeout: 120000 });
  const result = await page.evaluate(async () => ({
    ...((window as any).publicTiming), fcp: performance.getEntriesByName('first-contentful-paint')[0].startTime,
    metadata: await (await fetch('./build-info.json')).json(), resources: performance.getEntriesByType('resource').map(e => e.toJSON()),
  }));
  expect(errors).toEqual([]);
  writeFileSync(`.local/performance-20261023/public-cold-${phase}.json`, JSON.stringify({ phase, n: 1, browser: browser.version(), interactive, errors, ...result }, null, 2));
  console.log(JSON.stringify({ phase, ...result, resources: undefined, interactive, errors }));
  await context.close();
} finally { await browser.close(); }
