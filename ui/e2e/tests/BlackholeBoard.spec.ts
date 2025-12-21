import { test, expect } from '@playwright/test'

test('BlackholeBoard renders and captures visual baseline', async ({ page }) => {
  page.on('console', (msg) => console.log('console>', msg.text()))
  await page.goto('http://localhost:6006/iframe.html?id=board-blackholeboard--default', { waitUntil: 'networkidle' })
  const board = page.locator('[data-testid="blackhole-board"]')
  try {
    await page.waitForSelector('[data-testid="blackhole-board"]', { state: 'attached', timeout: 10000 })
  } catch (err) {
    console.log('failed waiting for board, saving debug artifacts')
    await page.screenshot({ path: 'test-results/blackhole-board-page.png', fullPage: true })
    const html = await page.content()
    require('fs').writeFileSync('test-results/blackhole-board-page.html', html)
    throw err
  }

  // Ensure board has height in case canvas is collapsed
  await page.addStyleTag({ content: '[data-testid="blackhole-board"] { min-height: 720px !important; height: 100vh !important; }' })
  await page.addStyleTag({ content: '* { animation-play-state: paused !important; transition: none !important; }' })
  await page.waitForTimeout(100)
  await expect(board).toBeVisible()
  await expect(page).toHaveScreenshot('blackhole-board-default.png')
})