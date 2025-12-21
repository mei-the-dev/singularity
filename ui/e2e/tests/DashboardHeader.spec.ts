import { test, expect } from '@playwright/test'

test('DashboardHeader renders', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=eventhorizon-dashboardheader--default')
  await page.waitForSelector('.eh-header')
  const header = page.locator('.eh-header')
  await expect(header).toHaveScreenshot('dashboard-header.png')
})
