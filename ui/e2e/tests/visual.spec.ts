import { test, expect } from '@playwright/test';

test('homepage visual snapshot', async ({ page }) => {
  await page.goto('/');
  const board = page.locator('.kanban-board');
  await expect(board).toBeVisible();
  const screenshot = await board.screenshot();
  expect(screenshot).toMatchSnapshot('kanban-board.png', { maxDiffPixelRatio: 0.001 });
});
