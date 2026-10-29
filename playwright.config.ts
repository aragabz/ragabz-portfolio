import { defineConfig, devices } from '@playwright/test';
import { base } from './site.config.mjs';

const port = 4321;
const basePath = base.endsWith('/') ? base : `${base}/`;

// Runs against the production build (`yarn build` first): Mermaid, Pagefind
// search, and the service worker only exist there.
export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${port}${basePath}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `yarn preview --port ${port}`,
    url: `http://localhost:${port}${basePath}`,
    reuseExistingServer: !process.env.CI,
  },
});
