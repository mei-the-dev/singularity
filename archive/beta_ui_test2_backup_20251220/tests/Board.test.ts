import { test, expect } from '@playwright/test';
import { gotoStory } from './test-utils';

test.describe('Board', () => {
  test('renders all columns', async ({ page }) => {
    await gotoStory(page, 'Templates/Board', 'Default');

    // Check board container
    const board = page.locator('[data-testid="board"]');
    await expect(board).toBeVisible();

    // Check all 5 columns are present
    const columns = page.locator('[data-testid="column"]');
    await expect(columns).toHaveCount(5);

    // Check column titles
    const columnTitles = ['Backlog', 'To Do', 'In Progress', 'Review', 'Done'];
    for (const title of columnTitles) {
      await expect(page.locator(`[data-testid="column-header"]`).filter({ hasText: title })).toBeVisible();
    }
  });

  test('displays issues in correct columns', async ({ page }) => {
    await gotoStory(page, 'Templates/Board', 'Default');

    // Check Backlog column (should be empty)
    const backlogColumn = page.locator('[data-testid="column"]').filter({ hasText: 'Backlog' });
    const backlogIssues = backlogColumn.locator('[data-testid="issue-card"]');
    await expect(backlogIssues).toHaveCount(0);

    // Check To Do column (should have 1 issue)
    const todoColumn = page.locator('[data-testid="column"]').filter({ hasText: 'To Do' });
    const todoIssues = todoColumn.locator('[data-testid="issue-card"]');
    await expect(todoIssues).toHaveCount(1);

    // Check In Progress column (should have 2 issues)
    const inProgressColumn = page.locator('[data-testid="column"]').filter({ hasText: 'In Progress' });
    const inProgressIssues = inProgressColumn.locator('[data-testid="issue-card"]');
    await expect(inProgressIssues).toHaveCount(2);

    // Check Review column (should have 1 issue)
    const reviewColumn = page.locator('[data-testid="column"]').filter({ hasText: 'Review' });
    const reviewIssues = reviewColumn.locator('[data-testid="issue-card"]');
    await expect(reviewIssues).toHaveCount(1);

    // Check Done column (should have 1 issue)
    const doneColumn = page.locator('[data-testid="column"]').filter({ hasText: 'Done' });
    const doneIssues = doneColumn.locator('[data-testid="issue-card"]');
    await expect(doneIssues).toHaveCount(1);
  });

  test('handles issue clicks across columns', async ({ page }) => {
    await gotoStory(page, 'Templates/Board', 'Default');

    // Mock console.log to verify click handler
    await page.evaluate(() => {
      console.log = (...args) => {
        window.testLog = args.join(' ');
      };
    });

    // Click an issue in In Progress column
    const inProgressColumn = page.locator('[data-testid="column"]').filter({ hasText: 'In Progress' });
    const issueCard = inProgressColumn.locator('[data-testid="issue-card"]').first();
    await issueCard.click();

    // Verify click handler was called
    const logMessage = await page.evaluate(() => (window as any).testLog);
    expect(logMessage).toContain('Issue clicked');
  });

  test('has responsive grid layout', async ({ page }) => {
    await gotoStory(page, 'Templates/Board', 'Default');

    const board = page.locator('[data-testid="board"]');

    // Check grid layout
    await expect(board).toHaveClass(/grid/);
    await expect(board).toHaveClass(/grid-cols-5/);
    await expect(board).toHaveClass(/gap-4/);
  });

  test('maintains proper column spacing', async ({ page }) => {
    await gotoStory(page, 'Templates/Board', 'Default');

    const columns = page.locator('[data-testid="column"]');

    // Check that columns have proper spacing between them
    for (let i = 0; i < 5; i++) {
      const column = columns.nth(i);
      await expect(column).toBeVisible();

      // Each column should have its own header and issues container
      await expect(column.locator('[data-testid="column-header"]')).toBeVisible();
      await expect(column.locator('[data-testid="issues-container"]')).toBeVisible();
    }
  });
});