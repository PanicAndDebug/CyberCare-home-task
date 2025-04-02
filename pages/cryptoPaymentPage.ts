import { Page, Locator } from "@playwright/test";
import { BasePage } from "../pages/basePage";

export class CryptoPaymentPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locator for total price on crypto payment page
  private totalPriceLocator: Locator = this.page.getByText(/NordVPN.*USD/i);

  // Get total price in USD (assuming it is dynamically displayed in the crypto payment page)
  public async getTotalPrice(): Promise<number> {
    await this.totalPriceLocator.waitFor({ state: "visible" });
    const priceText = await this.totalPriceLocator.textContent();
    return parseFloat(priceText?.replace(/[^\d.]/g, "") ?? "0");
  }
}

// public async getTotalPrice(): Promise<number> {
//   const priceText = await this.totalPriceLocator.textContent();

//   // Extract price using regex (matches a number before 'USD')
//   const priceMatch = priceText?.match(/(\d+\.\d{2,})\s*USD/);

//   if (!priceMatch) {
//       throw new Error(`Could not extract price from text: "${priceText}"`);
//   }

//   return parseFloat(priceMatch[1]);
// }

// }
