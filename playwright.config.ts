import { defineConfig, devices } from "@playwright/test";

/**
 * E2E/QA suite against the static export.
 * - QA_URL: base URL (default http://localhost:4173, started from `out/` if nothing is listening)
 * - PW_CHROMIUM: optional path to an existing Chromium (skips `npx playwright install chromium`)
 */
const baseURL = process.env.QA_URL || "http://localhost:4173";
const executablePath = process.env.PW_CHROMIUM || undefined;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  workers: 3,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL,
    launchOptions: { executablePath },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npx serve out -l 4173 --no-clipboard",
    url: "http://localhost:4173",
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], browserName: "chromium", viewport: { width: 412, height: 839 } },
    },
  ],
});
