import { test, expect } from '@playwright/test'

const stories = [
  { name: 'DashboardHeader', path: '/iframe.html?id=eventhorizon-dashboardheader--default', selector: '.eh-header' },
  { name: 'IssueCard', path: '/iframe.html?id=eventhorizon-issuecard--default', selector: '.issue-card' },
]

for (const s of stories) {
  test(`${s.name} renders without console errors`, async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.goto(`http://localhost:6006${s.path}`)
    await page.waitForSelector(s.selector, { timeout: 5000 })
    expect(errors).toEqual([])
  })
}
