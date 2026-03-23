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
    baseURL: 'http://localhost:5000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for API testing */
  projects: [
    {
      name: 'API Tests',
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        // API tests don't need browser context
      },
    },
  ],

  /* Run your local backend server before starting the tests */
  webServer: isCI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:5000/api/tasks',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
