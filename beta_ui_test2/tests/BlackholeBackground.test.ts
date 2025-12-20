import { test, expect } from '@playwright/test';
import { gotoStory } from './test-utils';

test.describe('BlackholeBackground', () => {
  test('renders animated blackhole background', async ({ page }) => {
    await gotoStory(page, 'Environment/BlackholeBackground', 'Default');

    // Check that the background container exists
    await expect(page.locator('[data-testid="blackhole-background"]')).toBeVisible();

    // Check for blackhole elements
    await expect(page.locator('.animate-pulse')).toBeVisible();
    await expect(page.locator('.animate-spin-slow')).toBeVisible();
    await expect(page.locator('.animate-spin-slower')).toBeVisible();
    await expect(page.locator('.animate-spin-reverse')).toBeVisible();

    // Check for orbiting particles
    const particles = page.locator('.animate-orbit');
    await expect(particles).toHaveCount(30);
  });

  test('blackhole follows mouse movement', async ({ page }) => {
    await gotoStory(page, 'Environment/BlackholeBackground', 'Default');

    // Get initial transform
    const background = page.locator('[data-testid="blackhole-background"]');
    const initialTransform = await background.evaluate(el => getComputedStyle(el).transform);

    // Move mouse
    await page.mouse.move(100, 100);
    await page.waitForTimeout(100);

    // Transform should change (mouse following effect)
    const newTransform = await background.evaluate(el => getComputedStyle(el).transform);
    expect(newTransform).not.toBe(initialTransform);
  });
});