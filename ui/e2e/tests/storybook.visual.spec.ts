import { test, expect } from '@playwright/test';

const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://localhost:6006';

test.describe('Storybook visual checks', () => {
  test('BlackholeBoard Default story loads', async ({ page }) => {
    const url = `${STORYBOOK_URL}/iframe.html?id=board-blackholeboard--default`;
    await page.goto(url, { waitUntil: 'networkidle' });
    // The component has data-testid="blackhole-board"
    await expect(page.locator('[data-testid="blackhole-board"]')).toBeVisible();
  });
});
