import { test, expect } from '@playwright/test'

test('Clicking issue card opens detail modal', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=board-blackholeboard--default')
  await page.waitForSelector('[data-testid="issue-card-1"]')
  const card = page.locator('[data-testid="issue-card-1"]')
  await expect(card).toBeVisible()
  await card.click()
  // Wait for modal overlay (z-50) and verify the selected issue id is visible inside it
  await page.waitForSelector('div.z-50', { timeout: 2000 })
  const modal = page.locator('div.z-50')
  await expect(modal.locator('text=#1')).toBeVisible()
  await expect(page).toHaveScreenshot('issue-card-modal.png')
})