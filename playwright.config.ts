import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  // Measure throttled performance after functional browsers have stopped competing
  // for host CPU. Keep the original 6x/1000-decision/5-second assertion unchanged.
  projects: [
    { name: "functional", grepInvert: /sixfold CPU/ },
    { name: "performance", grep: /sixfold CPU/, dependencies: ["functional"], workers: 1 },
  ],
  use: {
    baseURL: process.env.GAME_URL ?? `http://127.0.0.1:4173${process.env.GAME_PATH ?? "/"}`,
    viewport: { width: 1672, height: 941 },
    browserName: "chromium",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: process.env.GAME_URL
    ? undefined
    : {
        command: "node scripts/serve-production.mjs",
        env: { PORT: "4173" },
        port: 4173,
        reuseExistingServer: !process.env.CI,
      },
});
