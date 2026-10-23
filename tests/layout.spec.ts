import { test, expect } from '@playwright/test';

test('scene scale is correct in the first committed DOM before paint or passive effects', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
  await page.addInitScript(() => {
    const observer = new MutationObserver(() => {
      const scene = document.querySelector<HTMLElement>('.scene');
      if (!scene) return;
      (window as unknown as { firstScale: string }).firstScale = getComputedStyle(scene).getPropertyValue('--scene-scale').trim();
      observer.disconnect();
    });
    observer.observe(document, { childList: true, subtree: true });
  });
  await page.goto('./');
  await expect(page.locator('article')).toBeVisible();
  expect(await page.evaluate(() => Number((window as unknown as { firstScale: string }).firstScale)))
    .toBeCloseTo(Math.min(1920 / 1672, 1080 / 941), 10);
  await page.setViewportSize({ width: 1366, height: 768 });
  await expect.poll(() => page.locator('.scene').evaluate(e => Number(getComputedStyle(e).getPropertyValue('--scene-scale'))))
    .toBeCloseTo(Math.min(1366 / 1672, 768 / 941), 10);
});
