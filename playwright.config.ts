import { defineConfig, devices } from '@playwright/test';

const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://localhost:6006';
const CI = process.env.CI === 'true';

export default defineConfig({
  testDir: './ui/e2e/tests',
  snapshotDir: './ui/e2e/baselines',
  
  timeout: 30000,
  fullyParallel: !CI,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : undefined,
  
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],
  
  use: {
    baseURL: STORYBOOK_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.01,
      animations: 'disabled',
    },
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  webServer: CI ? undefined : {
    command: 'npm run storybook',
    url: STORYBOOK_URL,
    reuseExistingServer: true,
    timeout: 120000,
  },
});
