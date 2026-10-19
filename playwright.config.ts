import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  use: {
    baseURL: process.env.GAME_URL ?? "http://127.0.0.1:4173",
    viewport: { width: 1672, height: 941 },
    browserName: "chromium",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: process.env.GAME_URL
    ? undefined
    : {
        command: "npm run preview -- --port 4173 --strictPort",
        port: 4173,
        reuseExistingServer: !process.env.CI,
      },
});
