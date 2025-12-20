const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './ui/e2e/tests',
  use: {
    baseURL: process.env.STORYBOOK_URL || 'http://localhost:6006',
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } }
  ]
});
