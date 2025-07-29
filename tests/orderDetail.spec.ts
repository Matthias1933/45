import { test, expect } from '@playwright/test';
import fs from 'fs';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

test('order detail complex case matches design', async ({ page }) => {
  await page.goto('http://localhost:3000/index.html');
  await page.evaluate(() => window.openOrderDetail && window.openOrderDetail('2023-09-22'));
  const card = page.locator('.service-detail-card').first();
  const screenshot = await card.screenshot();
  const baseline = PNG.sync.read(fs.readFileSync('tests/baseline/order-detail.png'));
  const diff = new PNG({ width: screenshot.width, height: screenshot.height });
  const mismatched = pixelmatch(screenshot.data, baseline.data, diff.data, screenshot.width, screenshot.height, { threshold: 0.1 });
  expect(mismatched).toBeLessThanOrEqual(3);
});
