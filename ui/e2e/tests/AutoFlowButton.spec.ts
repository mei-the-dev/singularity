import { test, expect } from '@playwright/test';

test.describe('AutoFlowButton', () => {
  test('matches visual baseline', async ({ page }) => {
    await page.goto('http://localhost:6006/iframe.html?id=autoflowbutton--default');
    const root = page.locator('#root');
    await expect(root).toBeVisible();
    await expect(root).toHaveScreenshot('autoflowbutton-default.png');
  });
});
