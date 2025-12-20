import { test, expect } from '@playwright/test';

test('BlackholeBackground renders (Idle)', async ({ page }) => {
  await page.goto('/iframe.html?id=environment-blackholebackground--idle');
  await page.waitForSelector('[data-testid="blackhole-bg"]', { timeout: 5000 });
  const el = page.locator('[data-testid="blackhole-bg"]');
  await expect(el).toBeVisible();
  await page.screenshot({ path: 'ui/e2e/tests/baselines/blackholebackground-idle.png', fullPage: true });
});