import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const svg = await readFile('public/favicon.svg', 'utf8');
const browser = await chromium.launch();
for (const size of [180, 192, 512]) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await page.setContent(`<html><style>html,body{margin:0}svg{width:${size}px;height:${size}px}</style>${svg}</html>`);
  await page.locator('svg').screenshot({ path: `public/${size === 180 ? 'apple-touch-icon' : `icon-${size}`}.png` });
  await page.close();
}
await browser.close();
