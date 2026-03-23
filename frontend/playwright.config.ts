/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: isCI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* Set navigation timeout */
    navigationTimeout: 30000,
    
    /* Set action timeout */
    actionTimeout: 10000,
  },

  /* Configure projects for major browsers - reduced for faster e2e tests */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Only test Firefox and Mobile in CI to save time
    ...(isCI ? [
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
    ] : []),
  ],

  /* Run your local dev server before starting the tests */
  /* IMPORTANT: Backend MUST start before frontend to prevent "Failed to fetch" errors.
     When using an array, Playwright waits for each server sequentially in order.
     The backend is checked at /api/tasks endpoint to ensure it's fully ready. */
  webServer: isCI ? undefined : [
    {
      command: 'cd ../backend && npm run dev',
      url: 'http://localhost:5000/api/tasks',
      reuseExistingServer: true,
      timeout: 120 * 1000,
      // Wait for backend to be fully responsive
    },
    {
      command: 'npm start',
      url: 'http://localhost:3000',
      reuseExistingServer: true,
      timeout: 180 * 1000,
      // Frontend starts only after backend is ready
    },
  ],
});
