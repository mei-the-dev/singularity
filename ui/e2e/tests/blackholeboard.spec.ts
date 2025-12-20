import { test, expect } from '@playwright/test';

test('BlackholeBoard renders', async ({ page }) => {
  // Navigate to the story iframe for the default BlackholeBoard story
  await page.goto('/iframe.html?id=board-blackholeboard--default');
  await page.waitForSelector('[data-testid="blackhole-board"]', { timeout: 5000 });
  const el = page.locator('[data-testid="blackhole-board"]');
  await expect(el).toBeVisible();
  // Capture a baseline screenshot (CI can compare or store as artifact)
  await page.screenshot({ path: 'ui/e2e/tests/baselines/blackholeboard-default.png', fullPage: true });
});