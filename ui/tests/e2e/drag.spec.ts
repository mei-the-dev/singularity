import { test, expect } from '@playwright/test';

test('board loads and shows active state', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=AWAITING INPUT')).toBeVisible();
});
