import { Page, expect } from "@playwright/test";
import { BasePage } from "../pages/basePage";

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Verify login page
  async verifyLoginPage() {
    await expect(this.page).toHaveURL(/login/);
    await this.page.goBack();
  }
}
