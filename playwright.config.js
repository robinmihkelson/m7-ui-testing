import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "html",

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: [
    {
      command: "cd backend && node src/server.js",
      url: "http://localhost:3001/api/me",
      reuseExistingServer: true,
      stdout: "ignore",
      stderr: "pipe",
    },
    {
      command: "cd frontend && npm run dev",
      url: "http://localhost:5173",
      reuseExistingServer: true,
      stdout: "ignore",
      stderr: "pipe",
    },
  ],
});
