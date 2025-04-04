import { defineConfig } from "@playwright/test";

export default defineConfig({
  expect: {
    timeout: 5000,
  },
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
      },
    },
  ],
  reporter: [["html", { outputFolder: "playwright-report" }]],
});
