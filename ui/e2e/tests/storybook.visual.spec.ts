import { test, expect } from '@playwright/test';

const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://localhost:6006';

test.describe('Storybook visual checks', () => {
  test('BlackholeBoard Default story loads', async ({ page }) => {
    const url = `${STORYBOOK_URL}/?path=/story/board-blackholeboard--default`;
    await page.goto(url, { waitUntil: 'networkidle' });
    // wait for iframe to load canvas content
    const frame = await page.frameLocator('iframe#storybook-preview-iframe').locator('body');
    await expect(frame.locator('text=Event Horizon')).toHaveCount(1, { timeout: 10000 });
    // Optionally check manager UI; skip if not present
    // await expect(page.locator('text=Event Horizon')).toBeVisible({ timeout: 10000 });
  });
});
