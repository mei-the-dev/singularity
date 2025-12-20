import { test, expect } from '@playwright/test';

test('IssueCard renders (sample)', async ({ page }) => {
  // Try direct iframe approach first (works for static/sketchy manager setups)
  await page.goto('/iframe.html?id=molecules-issuecard--default');
  try {
    const el = await page.waitForSelector('[data-testid="issue-card-1001"]', { timeout: 60000 });
    await expect(el).toBeVisible();
    await el.screenshot({ path: 'ui/e2e/tests/baselines/issuecard-default.png' });
    return;
  } catch (err) {
    // Fallback: load manager and look inside preview iframe when available
    await page.goto('/?path=/story/molecules-issuecard--default');
    const frame = await page.waitForSelector('#storybook-preview-iframe', { timeout: 60000 });
    const preview = await frame.contentFrame();
    if (!preview) throw new Error('Preview frame not found');
    const locator = preview.locator('[data-testid="issue-card-1001"]');
    await locator.waitFor({ timeout: 60000 });
    await expect(locator).toBeVisible();
    await locator.screenshot({ path: 'ui/e2e/tests/baselines/issuecard-default.png' });
  }
});