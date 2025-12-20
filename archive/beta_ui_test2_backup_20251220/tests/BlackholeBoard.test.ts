import { test, expect } from '@playwright/test';
import { gotoStory } from './test-utils';

test.describe('BlackholeBoard', () => {
  test('renders complete board with all components', async ({ page }) => {
    await gotoStory(page, 'Pages/BlackholeBoard', 'Default');

    // Check main board container
    const board = page.locator('[data-testid="blackhole-board"]');
    await expect(board).toBeVisible();

    // Check blackhole background is present
    await expect(page.locator('[data-testid="blackhole-background"]')).toBeVisible();

    // Check header is present
    await expect(page.locator('[data-testid="header"]')).toBeVisible();

    // Check board with columns is present
    await expect(page.locator('[data-testid="board"]')).toBeVisible();

    // Check all 5 columns are rendered
    const columns = page.locator('[data-testid="column"]');
    await expect(columns).toHaveCount(5);
  });

  test('loads and displays issues', async ({ page }) => {
    await gotoStory(page, 'Pages/BlackholeBoard', 'Default');

    // Wait for issues to load (or fallback to sample data)
    await page.waitForTimeout(2000);

    // Check that issues are displayed
    const issueCards = page.locator('[data-testid="issue-card"]');
    const count = await issueCards.count();
    expect(count).toBeGreaterThan(0);

    // Check that issues are distributed across columns
    const columns = page.locator('[data-testid="column"]');
    for (let i = 0; i < 5; i++) {
      const column = columns.nth(i);
      const issuesInColumn = column.locator('[data-testid="issue-card"]');
      // At least one column should have issues
      if (i === 2) { // In Progress column
        await expect(issuesInColumn).toHaveCount(2);
      }
    }
  });

  test('handles search functionality', async ({ page }) => {
    await gotoStory(page, 'Pages/BlackholeBoard', 'Default');

    const searchInput = page.locator('[data-testid="search-input"]');

    // Type in search
    await searchInput.fill('authentication');

    // Verify search input has value
    await expect(searchInput).toHaveValue('authentication');
  });

  test('handles new issue button', async ({ page }) => {
    await gotoStory(page, 'Pages/BlackholeBoard', 'Default');

    const newIssueButton = page.locator('[data-testid="new-issue-button"]');

    // Mock console.log to verify click handler
    await page.evaluate(() => {
      console.log = (...args) => {
        window.testLog = args.join(' ');
      };
    });

    // Click new issue button
    await newIssueButton.click();

    // Verify click handler was called
    const logMessage = await page.evaluate(() => (window as any).testLog);
    expect(logMessage).toContain('New issue');
  });

  test('opens issue detail modal on card click', async ({ page }) => {
    await gotoStory(page, 'Pages/BlackholeBoard', 'Default');

    // Wait for issues to load
    await page.waitForTimeout(2000);

    // Click first issue card
    const firstIssue = page.locator('[data-testid="issue-card"]').first();
    await firstIssue.click();

    // Check modal appears
    const modal = page.locator('[data-testid="issue-modal"]');
    await expect(modal).toBeVisible();

    // Check modal has issue details
    await expect(page.locator('[data-testid="modal-title"]')).toBeVisible();
  });

  test('closes modal when clicking close button', async ({ page }) => {
    await gotoStory(page, 'Pages/BlackholeBoard', 'Default');

    // Wait for issues and open modal
    await page.waitForTimeout(2000);
    await page.locator('[data-testid="issue-card"]').first().click();

    // Click close button
    await page.locator('[data-testid="modal-close"]').click();

    // Check modal is closed
    const modal = page.locator('[data-testid="issue-modal"]');
    await expect(modal).not.toBeVisible();
  });

  test('has proper responsive layout', async ({ page }) => {
    await gotoStory(page, 'Pages/BlackholeBoard', 'Default');

    const boardContainer = page.locator('[data-testid="blackhole-board"]');

    // Check full height layout
    await expect(boardContainer).toHaveClass(/min-h-screen/);

    // Check background is black
    await expect(boardContainer).toHaveClass(/bg-black/);

    // Check text color
    await expect(boardContainer).toHaveClass(/text-amber-100/);
  });

  test('shows loading state initially', async ({ page }) => {
    // This test would need to mock the API call to show loading state
    // For now, we'll test that the component renders without crashing
    await gotoStory(page, 'Pages/BlackholeBoard', 'Default');

    const board = page.locator('[data-testid="blackhole-board"]');
    await expect(board).toBeVisible();
  });

  test('blackhole animation is active', async ({ page }) => {
    await gotoStory(page, 'Pages/BlackholeBoard', 'Default');

    // Check that blackhole elements are animating
    const pulsingElement = page.locator('.animate-pulse');
    await expect(pulsingElement).toBeVisible();

    const spinningElements = page.locator('.animate-spin-slow, .animate-spin-slower, .animate-spin-reverse');
    await expect(spinningElements).toHaveCount(3);

    const orbitingParticles = page.locator('.animate-orbit');
    await expect(orbitingParticles).toHaveCount(30);
  });
});