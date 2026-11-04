import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

// Runs against a production build in three browser engines:
// - Chromium via the locally installed Google Chrome (channel "chrome")
// - Firefox and WebKit (Safari's engine) from `npx playwright install firefox webkit`
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // Each browser decodes the hero video; more workers starve the single local
  // `next start` process (HTTP/1.1, no CDN) and make navigations time out.
  workers: 3,
  expect: { timeout: 10_000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    {
      name: "tablet",
      use: { ...devices["Pixel 7"], viewport: { width: 768, height: 1024 }, channel: "chrome" },
    },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
    {
      name: "small-mobile",
      use: { ...devices["Pixel 7"], viewport: { width: 320, height: 640 }, channel: "chrome" },
    },
    // Headless Firefox and WebKit decode the reel in software; one at a time keeps them responsive
    { name: "firefox", use: { ...devices["Desktop Firefox"] }, workers: 1 },
    { name: "iphone-webkit", use: { ...devices["iPhone 15"] }, workers: 1 },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
