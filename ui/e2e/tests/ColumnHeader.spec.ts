import { test, expect } from '@playwright/test'

test('ColumnHeader renders and shows count', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=dashboard-columnheader--default')
  await page.waitForSelector('.col-header')
  await expect(page.locator('.col-header__title')).toContainText('Backlog')
  await expect(page.locator('.col-header__count')).toContainText('3')
  await expect(page.locator('.col-header')).toHaveScreenshot('columnheader-default.png')
})