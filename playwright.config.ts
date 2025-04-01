import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  projects: [
    {
      name: "API Tests",
      testDir: "./tests/api",
      use: {
        baseURL: "https://api.nordvpn.com",
      },
    },
    {
      name: "Web Tests",
      testDir: "./tests/ui",
      use: {
        baseURL: "https://nordcheckout.com",
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
  reporter: [["html", { outputFolder: "playwright-report" }]],
});
