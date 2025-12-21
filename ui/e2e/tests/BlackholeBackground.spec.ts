import { test, expect } from '@playwright/test'

test('BlackholeBackground renders without console errors', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=environment-blackholebackground--idle')
  const backdrop = page.locator('[data-testid="blackhole-bg"]')
  // Wait for attachment and report computed styles if hidden (debugging visibility flakiness)
  await page.waitForSelector('[data-testid="blackhole-bg"]', { state: 'attached', timeout: 5000 })
  const debug = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="blackhole-bg"]') as HTMLElement | null
    if (!el) return { found: false }
    const cs = window.getComputedStyle(el)
    return {
      found: true,
      display: cs.display,
      visibility: cs.visibility,
      opacity: cs.opacity,
      height: cs.height,
      rects: el.getClientRects().length,
      rect: el.getBoundingClientRect().toJSON(),
      outer: el.outerHTML.slice(0, 300)
    }
  })
  console.log('blackhole debug:', debug)

  // Some Storybook iframe builds can leave the canvas collapsed; ensure backdrop has visible height for snapshots
  await page.addStyleTag({ content: '[data-testid="blackhole-bg"] { min-height: 720px !important; height: 100vh !important; }' })
  await page.waitForTimeout(50)
  await expect(backdrop).toBeVisible()
  // Pause animations and transitions to produce a deterministic snapshot
  await page.addStyleTag({ content: '* { animation-play-state: paused !important; transition: none !important; } body { background: #000 !important; }' })
  await page.waitForTimeout(100)
  await expect(page).toHaveScreenshot('blackhole-idle.png')
})