import { test, expect } from '@playwright/test';

test('pipeline widget runs and shows progress + result', async ({ page }) => {
  // stub GET /api/pipeline to return idle then running then success
  let callCount = 0;
  await page.route('**/api/pipeline', async (route) => {
    const req = route.request();
    if (req.method() === 'GET') {
      callCount += 1;
      if (callCount === 1) {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'idle', lastRun: null }) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'success', lastRun: 'now', duration: '3s' }) });
      }
      return;
    }
    if (req.method() === 'POST') {
      // simulate triggering a run
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, res: { status: 'running' } }) });
      return;
    }
    return route.continue();
  });

  await page.goto('/');
  const runBtn = page.locator('text=Run').first();
  await expect(runBtn).toBeVisible();

  await runBtn.click();
  await expect(page.locator('text=Running…')).toBeVisible();

  // Wait for subsequent GET to show success
  await page.waitForTimeout(200);
  await expect(page.locator('text=success')).toBeVisible();
});
