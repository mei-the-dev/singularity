// Playwright config for unified-ui
module.exports = {
  testDir: './tests',
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } }
  ],
  webServer: {
    command: 'npm run storybook',
    port: 6006,
    timeout: 120,
    reuseExistingServer: true
  }
};
