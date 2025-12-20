import { test, expect } from '@playwright/test';
import { gotoStory } from './test-utils';

test.describe('Header', () => {
  test('renders header with all elements', async ({ page }) => {
    await gotoStory(page, 'Organisms/Header', 'Default');

    // Check header container
    const header = page.locator('[data-testid="header"]');
    await expect(header).toBeVisible();

    // Check logo/brand
    await expect(page.locator('[data-testid="brand-logo"]')).toBeVisible();
    await expect(page.locator('[data-testid="brand-title"]')).toContainText('Event Horizon');
    await expect(page.locator('[data-testid="brand-subtitle"]')).toContainText('Component Development Lifecycle');

    // Check new issue button
    const newIssueButton = page.locator('[data-testid="new-issue-button"]');
    await expect(newIssueButton).toBeVisible();
    await expect(newIssueButton).toContainText('New Issue');

    // Check search input
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', 'Search issues...');

    // Check filters button
    await expect(page.locator('[data-testid="filters-button"]')).toContainText('Filters');
  });

  test('handles search input', async ({ page }) => {
    await gotoStory(page, 'Organisms/Header', 'Default');

    const searchInput = page.locator('[data-testid="search-input"]');

    // Type in search
    await searchInput.fill('authentication');
    await expect(searchInput).toHaveValue('authentication');

    // Clear search
    await searchInput.clear();
    await expect(searchInput).toHaveValue('');
  });

  test('handles new issue button click', async ({ page }) => {
    await gotoStory(page, 'Organisms/Header', 'Default');

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

  test('shows search query in WithSearchQuery story', async ({ page }) => {
    await gotoStory(page, 'Organisms/Header', 'WithSearchQuery');

    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toHaveValue('authentication');
  });

  test('has proper styling and layout', async ({ page }) => {
    await gotoStory(page, 'Organisms/Header', 'Default');

    const header = page.locator('[data-testid="header"]');

    // Check backdrop blur effect
    await expect(header).toHaveClass(/backdrop-blur/);

    // Check border styling
    await expect(header).toHaveClass(/border-amber-900/);

    // Check responsive layout (flex items)
    const brandSection = page.locator('[data-testid="brand-section"]');
    await expect(brandSection).toHaveClass(/flex/);

    const searchSection = page.locator('[data-testid="search-section"]');
    await expect(searchSection).toHaveClass(/flex/);
  });
});