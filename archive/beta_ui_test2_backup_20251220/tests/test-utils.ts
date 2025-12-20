import { Page } from '@playwright/test';

export async function gotoStory(page: Page, storyId: string, storyName: string = 'Default') {
  // Assuming Storybook is running on port 6006
  const storybookUrl = process.env.STORYBOOK_URL || 'http://localhost:6006';

  // Navigate to the story
  await page.goto(`${storybookUrl}/?path=/story/${storyId.replace(/\//g, '--').toLowerCase()}--${storyName.toLowerCase()}`);

  // Wait for the story to load
  await page.waitForSelector('[data-testid="story-root"]', { timeout: 10000 });
}

export async function waitForAnimation(page: Page, selector: string, timeout = 1000) {
  await page.waitForTimeout(timeout);
  return page.locator(selector);
}