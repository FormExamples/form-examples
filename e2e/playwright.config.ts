import { defineConfig, devices } from '@playwright/test';

/**
 * Shared config for the form front-end smoke + accessibility sweep. Each spec
 * spins up its own static/preview server per form (see lib/server.ts), so no
 * global webServer is configured here.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // One retry everywhere: the per-form static server + networkidle wait can
  // flake under parallel load; a genuine failure fails both attempts.
  retries: 1,
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  timeout: 60_000,
  use: {
    ...devices['Desktop Chrome'],
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
