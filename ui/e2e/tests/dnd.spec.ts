import { test, expect } from '@playwright/test';

test('drag and drop moves card and triggers API POST', async ({ page }) => {
  // Mock initial GET /api/issues response
  await page.route('**/api/issues', (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ issues: [{ id: '1', title: 'Test Issue', status: 'backlog' }] }),
      });
    }
    return route.continue();
  });

  // Navigate to app
  await page.goto('/');

  const backlogColumn = page.locator('[aria-label="Backlog issues"]');
  const inProgressColumn = page.locator('[aria-label="In Progress issues"]');
  const card = page.locator('text=Test Issue').first();

  // Wait for card to appear
  await expect(card).toBeVisible();

  const postPromise = page.waitForRequest((req) => req.url().endsWith('/api/issues') && req.method() === 'POST');

  // Perform drag and drop
  await card.dragTo(inProgressColumn);

  const postReq = await postPromise;
  const body = JSON.parse(postReq.postData() || '{}');
  expect(body).toHaveProperty('id', '1');
  expect(body).toHaveProperty('status');
  // Depending on app mapping, status may be 'in-progress' or something similar
  expect(['in-progress', 'in_progress', 'progress']).toContain(body.status || '');

  // Assert card is now visible in target column
  await expect(inProgressColumn.locator('text=Test Issue')).toBeVisible();
});
