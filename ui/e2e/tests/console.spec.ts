import { test } from '@playwright/test';

test('capture console and page errors', async ({ page }) => {
  page.on('console', (msg) => {
    console.log(`[console:${msg.type()}] ${msg.text()}`);
  });
  page.on('pageerror', (err) => {
    console.error(`[pageerror] ${err.message}\n${err.stack}`);
  });
  page.on('requestfailed', (req) => {
    console.warn(`[requestfailed] ${req.url()} ${req.failure()?.errorText}`);
  });

  await page.goto('http://localhost:3002/');
  // keep the page open for a short period to capture runtime activity
  await page.waitForTimeout(5000);
});
