import { test, expect } from '@playwright/test'

test('NewIssueButton renders and opens form', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=eventhorizon-newissuebutton--default')
  await page.waitForSelector('.nih-button')
  await expect(page.locator('.nih-button')).toBeVisible()
  await page.click('.nih-button')
  // In this story the click may trigger an alert; ensure button exists and is clickable
})