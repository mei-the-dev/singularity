import { test, expect } from '@playwright/test';

// Simple DnD smoke test: open the app, find a backlog item, simulate drag to In Progress
// Note: This test is intentionally minimal as a scaffold — expand with robust selectors

test('drag backlog → in progress', async ({ page }) => {
  await page.goto(process.env.E2E_BASE_URL || 'http://localhost:3000');
  await expect(page.locator('text=Backlog')).toBeVisible();

  const card = page.locator('[aria-label^="Issue card:"]').first();
  await expect(card).toBeVisible();

  // basic drag and drop via Playwright's mouse events
  const from = await card.boundingBox();
  const toColumn = page.locator('text=In Progress').first();
  const to = await toColumn.boundingBox();
  if (from && to) {
    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(to.x + 50, to.y + 50, { steps: 10 });
    await page.mouse.up();
  }

  // assert that an API call or UI update occurred — simple check for item now under In Progress
  await expect(page.locator('section:has-text("In Progress")')).toContainText('#');
});
