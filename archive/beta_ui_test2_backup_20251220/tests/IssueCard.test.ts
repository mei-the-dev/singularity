import { test, expect } from '@playwright/test';
import { gotoStory } from './test-utils';

test.describe('IssueCard', () => {
  test('renders issue card with all elements', async ({ page }) => {
    await gotoStory(page, 'Molecules/IssueCard', 'Default');

    // Check main card container
    const card = page.locator('[data-testid="issue-card"]');
    await expect(card).toBeVisible();

    // Check priority badge
    await expect(page.locator('[data-testid="priority-badge"]')).toBeVisible();
    await expect(page.locator('[data-testid="priority-badge"]')).toContainText('high');

    // Check type icon
    await expect(page.locator('[data-testid="type-icon"]')).toBeVisible();

    // Check issue ID
    await expect(page.locator('[data-testid="issue-id"]')).toContainText('#1');

    // Check title
    await expect(page.locator('[data-testid="issue-title"]')).toContainText('Implement authentication module');

    // Check assignee avatar
    await expect(page.locator('[data-testid="assignee-avatar"]')).toBeVisible();

    // Check story points
    await expect(page.locator('[data-testid="story-points"]')).toContainText('8pt');
  });

  test('shows hover effects', async ({ page }) => {
    await gotoStory(page, 'Molecules/IssueCard', 'Default');

    const card = page.locator('[data-testid="issue-card"]');

    // Check initial state
    await expect(card).toHaveClass(/border-amber-800/);

    // Hover over card
    await card.hover();

    // Check hover state (border should change)
    await expect(card).toHaveClass(/border-amber-600/);

    // Check action buttons appear on hover
    await expect(page.locator('[data-testid="action-buttons"]')).toBeVisible();
  });

  test('handles click interaction', async ({ page }) => {
    await gotoStory(page, 'Molecules/IssueCard', 'Default');

    const card = page.locator('[data-testid="issue-card"]');

    // Mock console.log to verify click handler
    await page.evaluate(() => {
      console.log = (...args) => {
        window.testLog = args.join(' ');
      };
    });

    // Click the card
    await card.click();

    // Verify click handler was called (this would need to be adapted based on actual implementation)
    const logMessage = await page.evaluate(() => (window as any).testLog);
    expect(logMessage).toContain('Issue clicked');
  });

  test('displays different priority colors', async ({ page }) => {
    await gotoStory(page, 'Molecules/IssueCard', 'CriticalPriority');

    const priorityBadge = page.locator('[data-testid="priority-badge"]');
    await expect(priorityBadge).toContainText('critical');
    await expect(priorityBadge).toHaveClass(/bg-red-500/);
  });

  test('displays different types', async ({ page }) => {
    await gotoStory(page, 'Molecules/IssueCard', 'CriticalPriority');

    const typeIcon = page.locator('[data-testid="type-icon"]');
    await expect(typeIcon).toHaveClass(/text-amber-600/); // AlertCircle icon for bug type
  });
});