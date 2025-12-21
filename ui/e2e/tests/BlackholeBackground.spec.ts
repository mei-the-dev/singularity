import { test, expect } from '@playwright/test'

test('BlackholeBackground renders without console errors', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=environment-blackholebackground--idle')
  const backdrop = page.locator('[data-testid="blackhole-bg"]')
  await expect(backdrop).toBeVisible()
  // Pause animations and transitions to produce a deterministic snapshot
  await page.addStyleTag({ content: '* { animation-play-state: paused !important; transition: none !important; } body { background: #000 !important; }' })
  await page.waitForTimeout(100)
  await expect(page).toHaveScreenshot('blackhole-idle.png')
})