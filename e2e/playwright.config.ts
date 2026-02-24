import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Resolve tests relative to this config file (e2e/)
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    // Always reuse an existing dev server if it's already running.
    reuseExistingServer: true,
  },
});
