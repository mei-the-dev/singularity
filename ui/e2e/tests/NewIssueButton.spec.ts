import { test, expect } from '@playwright/test'

test('NewIssueButton is visible and clickable', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=molecules-newissuebutton--default')
  const btn = page.locator('[data-testid="new-issue-button"]')
  await page.waitForSelector('[data-testid="new-issue-button"]')
  await expect(btn).toBeVisible()
  await expect(page).toHaveScreenshot('new-issue-button.png')
})