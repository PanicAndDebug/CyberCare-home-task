import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "../pages/basePage";

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  private orderSummaryContainer: Locator = this.page.getByTestId(
    "order-summary-container",
  );
  private planDropdown: Locator =
    this.orderSummaryContainer.getByRole("combobox");
  private preVatTotalLocator: Locator = this.page.getByTestId(
    "SelectedCartSummaryCard-total-price",
  );
  private postVatTotalLocator: Locator = this.page.getByTestId(
    "CartSummary-total-amount",
  );
  private emailInput: Locator = this.page.getByTestId("email-address-input");
  private cryptoPaymentOption: Locator = this.page.getByRole("tab", {
    name: "bitcoin ethereum ripple",
  });
  private confirmCrypto: Locator = this.page.locator(
    'button[data-testid="payment-form-submit-button"]',
  );

  // Select a plan and return its price and savings percentage
  public async getPlanPriceAndSavings(partialPlanName: string) {
    await this.planDropdown.click();
    const option = await this.page.getByRole("option", {
      name: new RegExp(partialPlanName, "i"),
    });

    const savingsMatch = (await option.textContent())?.match(/Save\s*(\d+)%/);
    const savingsPercentage = savingsMatch
      ? parseFloat(savingsMatch[1]) / 100
      : 0;
    await option.click();
    await this.page.waitForTimeout(1000);

    const priceText = await this.preVatTotalLocator.textContent();
    const planPrice = parseFloat(priceText?.replace(/[^\d.]/g, "") || "0");

    let months = 1;
    if (/1-year/i.test(partialPlanName)) {
      months = 12;
    } else if (/2-year/i.test(partialPlanName)) {
      months = 24;
    }

    return { planPrice, savingsPercentage, months };
  }

  // Compare selected plan price with monthly plan price
  public async comparePlanWithMonthly(partialPlanName: string) {
    const { planPrice, savingsPercentage, months } =
      await this.getPlanPriceAndSavings(partialPlanName);
    const { planPrice: monthlyPlanPrice } = await this.getPlanPriceAndSavings(
      "Monthly plan | No savings",
    );

    const expectedMonthlyPlanPrice =
      monthlyPlanPrice * months * (1 - savingsPercentage);
    const roundedExpectedPrice = parseFloat(
      expectedMonthlyPlanPrice.toFixed(2),
    );

    expect(planPrice).toBeGreaterThanOrEqual(roundedExpectedPrice - 20);
    expect(planPrice).toBeLessThanOrEqual(roundedExpectedPrice + 20);
  }

  // Enter email dynamically
  public async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }

  // Select plan from dropdown by its name
  public async selectPlan(planName: string) {
    await this.planDropdown.click();
    const option = await this.page.getByRole("option", {
      name: new RegExp(planName, "i"),
    });
    await option.click();
  }

  // Parse price from a locator
  private async parsePrice(priceLocator: Locator): Promise<number> {
    const priceText = await priceLocator.textContent();
    return parseFloat(priceText?.replace(/[^\d.]/g, "") ?? "0");
  }

  // Get total price (pre and post VAT)
  public async getTotalPricePreVat(): Promise<number> {
    return await this.parsePrice(this.preVatTotalLocator);
  }

  public async getTotalPricePostVat(): Promise<number> {
    return await this.parsePrice(this.postVatTotalLocator);
  }

  // // Proceed to crypto payment page
  // public async proceedToCryptoPayment() {
  //   // Listen for network requests BEFORE performing actions
  //   this.page.on("request", (request) =>
  //     console.log("Request:", request.url()),
  //   );
  //   this.page.on("response", (response) =>
  //     console.log("Response:", response.url(), response.status()),
  //   );

  //   await this.cryptoPaymentOption.click();
  //   await this.confirmCrypto.hover();

  //   // Wait for button to be visible and enabled
  //   await this.confirmCrypto.waitFor({ state: "visible", timeout: 5000 });
  //   await expect(this.confirmCrypto).toBeEnabled();

  //   // Click the button (force click if necessary)
  //   await this.confirmCrypto.click({ force: true });

  //   // Ensure it's an HTML element before clicking via JavaScript
  //   await this.page.evaluate(
  //     (el) => {
  //       if (el instanceof HTMLElement) {
  //         el.click();
  //       }
  //     },
  //     await this.page.$('[data-testid="payment-form-submit-button"]'),
  //   );

  // // Try pressing 'Enter' as an alternative action
  // await this.confirmCrypto.focus();
  // await this.page.keyboard.press('Enter');

  // // Debug the button's bounding box (check if it's positioned correctly)
  // const box = await this.confirmCrypto.boundingBox();
  // console.log('Button bounding box:', box);

  // // Scroll into view if needed (helps if the button is off-screen)
  // await this.confirmCrypto.scrollIntoViewIfNeeded();

  // Verify the URL change
  //     await this.page.waitForURL('https://pay.coingate.com/invoice/*', { timeout: 10000 });
}
