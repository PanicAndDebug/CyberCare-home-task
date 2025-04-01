import { Page } from "@playwright/test";
import { BasePage } from "../pages/basePage";

export class ProductsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators for elements on the Products Page
  private buyNordVPNButton = this.page.locator("text=Buy NordVPN");
  private loginLink = this.page.locator("text=Log In");
  private oneYearPlan = this.page.locator("text=1-year-plan");
  private continueToPayment = this.page.locator("text=Continue to payment");

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

  // Select the 1-year plan option
  async selectOneYearPlan() {
    await this.oneYearPlan.click();
  }

  // Click the "Continue to payment" button
  async clickContinueToPayment() {
    await this.continueToPayment.click();
  }

  // Go back to the previous page
  async goBack() {
    await this.page.goBack();
  }
}
