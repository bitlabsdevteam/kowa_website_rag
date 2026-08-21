import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    launchOptions: {
      // Headless Chromium's default ANGLE-on-Vulkan SwiftShader fails to create
      // WebGL contexts on macOS; the GL-backed SwiftShader path works.
      args: ['--use-angle=swiftshader'],
    },
  },
  projects: [
    // Desktop runs every spec except the mobile-only story spec; mobile
    // projects run the touch/phone story in both browser engines.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: '**/v28-factory-story-mobile.spec.ts',
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
      testMatch: '**/v28-factory-story-mobile.spec.ts',
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: '**/v28-factory-story-mobile.spec.ts',
    },
    {
      name: 'mobile-webkit',
      use: { ...devices['iPhone 13'] },
      testMatch: '**/v28-factory-story-mobile.spec.ts',
    },
  ],
  webServer: {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
