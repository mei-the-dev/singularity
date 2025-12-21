import { test, expect } from '@playwright/test';

test('TestCard renders correctly', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=test-testcard--default');
  await page.waitForSelector('[data-testid="testcard-root"]');
  await expect(page).toHaveScreenshot('testcard-default.png');
});
