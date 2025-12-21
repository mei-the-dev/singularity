import { test, expect } from '@playwright/test'

test('BlackholeBoard renders and captures visual baseline', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=board-blackholeboard--default')
  const board = page.locator('[data-testid="blackhole-board"]')
  await page.waitForSelector('[data-testid="blackhole-board"]', { state: 'attached', timeout: 5000 })
  // Ensure board has height in case canvas is collapsed
  await page.addStyleTag({ content: '[data-testid="blackhole-board"] { min-height: 720px !important; height: 100vh !important; }' })
  await page.addStyleTag({ content: '* { animation-play-state: paused !important; transition: none !important; }' })
  await page.waitForTimeout(100)
  await expect(board).toBeVisible()
  await expect(page).toHaveScreenshot('blackhole-board-default.png')
})