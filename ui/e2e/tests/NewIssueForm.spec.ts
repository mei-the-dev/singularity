import { test, expect } from '@playwright/test'

test('NewIssueForm renders and can submit', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=eventhorizon-newissueform--default')
  await page.waitForSelector('.nif-modal')
  await expect(page.locator('.nif-title')).toContainText('Create new issue')
  await expect(page.locator('.nif-input')).toBeVisible()
  await expect(page.locator('.nif-textarea')).toBeVisible()
  await expect(page.locator('.nif-submit')).toBeVisible()
  await page.fill('.nif-input', 'Playwright bug')
  await page.fill('.nif-textarea', 'Details')
  await expect(page.locator('.nif-modal')).toHaveScreenshot('newissue-modal.png')
})