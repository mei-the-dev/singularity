import { test, expect } from '@playwright/test';

test('IssueCard renders (sample)', async ({ page }) => {
  // Load manager page, wait for preview iframe, then check inside iframe
  await page.goto('/?path=/story/molecules-issuecard--default');
  // Wait for the preview iframe to be attached and loaded
  const frame = await page.waitForSelector('#storybook-preview-iframe', { timeout: 15000 });
  const preview = await frame.contentFrame();
  if (!preview) throw new Error('Preview frame not found');
  const locator = preview.locator('[data-testid="issue-card-1001"]');
  await locator.waitFor({ timeout: 15000 });
  await expect(locator).toBeVisible();
  await locator.screenshot({ path: 'ui/e2e/tests/baselines/issuecard-default.png' });
});