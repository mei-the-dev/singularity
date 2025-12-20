import { test, expect } from '@playwright/test';

test('IssueCard renders (sample)', async ({ page }) => {
  await page.goto('/iframe.html?id=molecules-issuecard--default');
  await page.waitForSelector('[data-testid="issue-card-1001"]', { timeout: 5000 });
  const el = page.locator('[data-testid="issue-card-1001"]');
  await expect(el).toBeVisible();
  await page.screenshot({ path: 'ui/e2e/tests/baselines/issuecard-default.png', fullPage: true });
});