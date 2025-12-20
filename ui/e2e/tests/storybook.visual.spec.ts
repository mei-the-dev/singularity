import { test, expect } from '@playwright/test';

const STORYBOOK_BASE = process.env.STORYBOOK_BASE || 'http://localhost:9001';

test.describe('Storybook visual checks', () => {
  test('IssueCard story matches snapshot', async ({ page }) => {
    await page.goto(`${STORYBOOK_BASE}/?path=/story/components-issuecard--default`);
    const canvas = page.locator('#storybook-root');
    await expect(canvas).toBeVisible();
    const component = page.locator('[aria-label^="Issue card:"]').first();
    await expect(component).toBeVisible();
    await expect(component).toHaveScreenshot('issuecard-default.png', { maxDiffPixels: 200 });
  });

  test('KanbanColumn story matches snapshot', async ({ page }) => {
    await page.goto(`${STORYBOOK_BASE}/?path=/story/components-kanbancolumn--default`);
    const column = page.locator('section:has-text("Backlog")').first();
    await expect(column).toBeVisible();
    await expect(column).toHaveScreenshot('kanbancolumn-default.png', { maxDiffPixels: 300 });
  });
});
