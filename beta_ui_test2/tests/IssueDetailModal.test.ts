import { test, expect } from '@playwright/test';
import { gotoStory } from './test-utils';

test.describe('IssueDetailModal', () => {
  test('renders modal with issue details', async ({ page }) => {
    await gotoStory(page, 'Organisms/IssueDetailModal', 'Default');

    // Check modal container
    const modal = page.locator('[data-testid="issue-modal"]');
    await expect(modal).toBeVisible();

    // Check modal overlay
    await expect(page.locator('[data-testid="modal-overlay"]')).toBeVisible();

    // Check issue title
    await expect(page.locator('[data-testid="modal-title"]')).toContainText('Implement authentication module');

    // Check issue ID
    await expect(page.locator('[data-testid="modal-issue-id"]')).toContainText('#1');

    // Check close button
    await expect(page.locator('[data-testid="modal-close"]')).toBeVisible();
  });

  test('displays issue metadata correctly', async ({ page }) => {
    await gotoStory(page, 'Organisms/IssueDetailModal', 'Default');

    // Check status field
    const statusField = page.locator('[data-testid="field-status"]');
    await expect(statusField.locator('[data-testid="field-label"]')).toContainText('Status');
    await expect(statusField.locator('[data-testid="field-value"]')).toContainText('inprogress');

    // Check priority field
    const priorityField = page.locator('[data-testid="field-priority"]');
    await expect(priorityField.locator('[data-testid="field-label"]')).toContainText('Priority');
    await expect(priorityField.locator('[data-testid="field-value"]')).toContainText('high');

    // Check story points field
    const pointsField = page.locator('[data-testid="field-points"]');
    await expect(pointsField.locator('[data-testid="field-label"]')).toContainText('Story Points');
    await expect(pointsField.locator('[data-testid="field-value"]')).toContainText('8');
  });

  test('shows issue description', async ({ page }) => {
    await gotoStory(page, 'Organisms/IssueDetailModal', 'Default');

    const descriptionField = page.locator('[data-testid="field-description"]');
    await expect(descriptionField.locator('[data-testid="field-label"]')).toContainText('Description');
    await expect(descriptionField.locator('[data-testid="field-value"]')).toContainText('This component requires careful implementation');
  });

  test('displays action buttons', async ({ page }) => {
    await gotoStory(page, 'Organisms/IssueDetailModal', 'Default');

    // Check Start Development button
    const startDevButton = page.locator('[data-testid="start-dev-button"]');
    await expect(startDevButton).toBeVisible();
    await expect(startDevButton).toContainText('Start Development');

    // Check View in GitHub button
    const githubButton = page.locator('[data-testid="github-link"]');
    await expect(githubButton).toBeVisible();
    await expect(githubButton).toContainText('View in GitHub');
  });

  test('handles close button click', async ({ page }) => {
    await gotoStory(page, 'Organisms/IssueDetailModal', 'Default');

    const closeButton = page.locator('[data-testid="modal-close"]');

    // Mock console.log to verify close handler
    await page.evaluate(() => {
      console.log = (...args) => {
        window.testLog = args.join(' ');
      };
    });

    // Click close button
    await closeButton.click();

    // Verify close handler was called
    const logMessage = await page.evaluate(() => (window as any).testLog);
    expect(logMessage).toContain('Modal closed');
  });

  test('handles overlay click to close', async ({ page }) => {
    await gotoStory(page, 'Organisms/IssueDetailModal', 'Default');

    const overlay = page.locator('[data-testid="modal-overlay"]');

    // Mock console.log to verify close handler
    await page.evaluate(() => {
      console.log = (...args) => {
        window.testLog = args.join(' ');
      };
    });

    // Click overlay
    await overlay.click();

    // Verify close handler was called
    const logMessage = await page.evaluate(() => (window as any).testLog);
    expect(logMessage).toContain('Modal closed');
  });

  test('prevents modal content click from closing', async ({ page }) => {
    await gotoStory(page, 'Organisms/IssueDetailModal', 'Default');

    const modalContent = page.locator('[data-testid="modal-content"]');

    // Mock console.log to verify close handler is NOT called
    await page.evaluate(() => {
      window.testLog = null;
      console.log = (...args) => {
        window.testLog = args.join(' ');
      };
    });

    // Click modal content
    await modalContent.click();

    // Verify close handler was NOT called
    const logMessage = await page.evaluate(() => (window as any).testLog);
    expect(logMessage).toBeNull();
  });

  test('displays different priority styling', async ({ page }) => {
    await gotoStory(page, 'Organisms/IssueDetailModal', 'CriticalIssue');

    const priorityField = page.locator('[data-testid="field-priority"]');
    await expect(priorityField.locator('[data-testid="field-value"]')).toContainText('critical');
  });

  test('has proper modal styling and animations', async ({ page }) => {
    await gotoStory(page, 'Organisms/IssueDetailModal', 'Default');

    const modal = page.locator('[data-testid="modal-content"]');

    // Check modal styling
    await expect(modal).toHaveClass(/rounded-2xl/);
    await expect(modal).toHaveClass(/shadow-2xl/);
    await expect(modal).toHaveClass(/backdrop-blur/);

    // Check animations
    await expect(modal).toHaveClass(/animate-slideUp/);
  });
});