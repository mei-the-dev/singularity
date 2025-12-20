import { test, expect } from '@playwright/test';
import { gotoStory } from './test-utils';

test.describe('Column', () => {
  test('renders column with header and issues', async ({ page }) => {
    await gotoStory(page, 'Organisms/Column', 'Default');

    // Check column container
    const column = page.locator('[data-testid="column"]');
    await expect(column).toBeVisible();

    // Check column header
    const header = page.locator('[data-testid="column-header"]');
    await expect(header).toBeVisible();
    await expect(header).toContainText('In Progress');

    // Check issue count badge
    const countBadge = page.locator('[data-testid="issue-count"]');
    await expect(countBadge).toContainText('2'); // Should show 2 issues

    // Check issues container
    const issuesContainer = page.locator('[data-testid="issues-container"]');
    await expect(issuesContainer).toBeVisible();

    // Check individual issue cards
    const issueCards = page.locator('[data-testid="issue-card"]');
    await expect(issueCards).toHaveCount(2);
  });

  test('displays different column colors', async ({ page }) => {
    await gotoStory(page, 'Organisms/Column', 'Default');

    const header = page.locator('[data-testid="column-header"]');

    // Check gradient background for "In Progress" column
    await expect(header).toHaveClass(/from-amber-600/);
    await expect(header).toHaveClass(/to-amber-500/);
  });

  test('handles issue click interactions', async ({ page }) => {
    await gotoStory(page, 'Organisms/Column', 'Default');

    const issueCards = page.locator('[data-testid="issue-card"]');

    // Mock console.log to verify click handler
    await page.evaluate(() => {
      console.log = (...args) => {
        window.testLog = args.join(' ');
      };
    });

    // Click first issue
    await issueCards.first().click();

    // Verify click handler was called
    const logMessage = await page.evaluate(() => (window as any).testLog);
    expect(logMessage).toContain('Issue clicked');
  });

  test('shows empty state', async ({ page }) => {
    await gotoStory(page, 'Organisms/Column', 'Empty');

    // Check column header still shows
    const header = page.locator('[data-testid="column-header"]');
    await expect(header).toBeVisible();

    // Check issue count is 0
    const countBadge = page.locator('[data-testid="issue-count"]');
    await expect(countBadge).toContainText('0');

    // Check issues container is empty
    const issueCards = page.locator('[data-testid="issue-card"]');
    await expect(issueCards).toHaveCount(0);

    // Check minimum height is maintained
    const issuesContainer = page.locator('[data-testid="issues-container"]');
    const height = await issuesContainer.evaluate(el => el.clientHeight);
    expect(height).toBeGreaterThan(500); // min-h-[600px] equivalent
  });

  test('has proper layout and spacing', async ({ page }) => {
    await gotoStory(page, 'Organisms/Column', 'Default');

    const column = page.locator('[data-testid="column"]');

    // Check flex layout
    await expect(column).toHaveClass(/flex/);
    await expect(column).toHaveClass(/flex-col/);

    // Check issues have proper spacing
    const issuesContainer = page.locator('[data-testid="issues-container"]');
    await expect(issuesContainer).toHaveClass(/space-y-3/);

    // Check backdrop blur
    await expect(column).toHaveClass(/backdrop-blur/);
  });
});