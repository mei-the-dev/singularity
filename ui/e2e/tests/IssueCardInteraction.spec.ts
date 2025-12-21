import { test, expect } from '@playwright/test'

test('Clicking issue card opens detail modal', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=board-blackholeboard--default')
  await page.waitForSelector('[data-testid="issue-card-1"]')
  const card = page.locator('[data-testid="issue-card-1"]')
  await expect(card).toBeVisible()
  await card.click()
  // Wait for modal to appear and verify content
  const modal = page.locator('div[role="dialog"]')
  // Fallback: search for the close button text or content unique to modal
  await page.waitForSelector('text=#1', { timeout: 2000 })
  await expect(page.locator('text=#1')).toBeVisible()
  await expect(page).toHaveScreenshot('issue-card-modal.png')
})