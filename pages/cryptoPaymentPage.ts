import { Page, Locator } from "@playwright/test";

export class CryptoPaymentPage {
  page: Page;
  priceLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.priceLocator = this.page.locator(
      '[data-test="p-amount-in-price-currency"]',
    );
  }

  // Function to get the price in USD
  async getPriceInUSD() {
    const priceText = await this.priceLocator.textContent();
    return priceText ? parseFloat(priceText.replace(/[^\d.]/g, "")) : 0;
  }
}
