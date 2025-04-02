import { Page, Locator } from "@playwright/test";
import { BasePage } from "../pages/basePage";

export class ProductsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators for elements on the Products Page
  private buyNordVPNButton: Locator = this.page.locator("text=Buy NordVPN");
  private loginLink: Locator = this.page.locator("text=Log In");

  // Navigate to the products page
  async navigate() {
    await this.page.goto("/products");
  }

  // Click the "Buy NordVPN" button
  async clickBuyNordVPN() {
    await this.buyNordVPNButton.click();
  }

  // Click the "Log In" link
  async clickLogin() {
    await this.loginLink.click();
  }
}
