import { Page, Locator } from "@playwright/test";
import { BasePage } from "../pages/basePage";

export class ProductsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private buyNordVPNButton: Locator = this.page.locator("text=Buy NordVPN");

  async navigate() {
    await this.page.goto("/products");
  }

  async clickBuyNordVPN() {
    await this.buyNordVPNButton.click();
  }
}
