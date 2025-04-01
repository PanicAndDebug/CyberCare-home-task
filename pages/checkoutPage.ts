import { Page, expect } from "@playwright/test";
import { BasePage } from "../pages/basePage";

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Locators
  private orderSummaryContainer = this.page.getByTestId(
    "order-summary-container",
  );
  private planDropdown = this.orderSummaryContainer.getByRole("combobox");
  private totalPriceLocator = this.page.getByTestId(
    "SelectedCartSummaryCard-total-price",
  );
  private emailInput = this.page.getByTestId("email-address-input");
  private cryptoPay = this.page.getByTestId("coin_gate");
  private confirmCrypto = this.page.getByTestId("payment-form-submit-button");

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
    await this.page.waitForTimeout(1000); // Ensure price updates
    const priceText = await this.totalPriceLocator.textContent();
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

    // Calculate expected monthly plan price
    const expectedMonthlyPlanPrice =
      monthlyPlanPrice * months * (1 - savingsPercentage);

    // Debugging: Log both the expected and actual price
    console.log("Expected Monthly Plan Price:", expectedMonthlyPlanPrice);
    console.log("Received Plan Price:", planPrice);

    // Round the expected value to 2 decimal places to match the format of the price
    const roundedExpectedPrice = parseFloat(
      expectedMonthlyPlanPrice.toFixed(2),
    );

    // Compare using toBeCloseTo with a precision of 0.01 (or adjust as needed)
    expect(planPrice).toBeCloseTo(roundedExpectedPrice, 2); // Adjust precision if necessary
  }

  // Enter email dynamically
  public async enterEmail(email: string) {
    //await this.emailInput.click();
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

  // Get total price from the order summary
  public async getTotalPrice(): Promise<number> {
    const priceText = await this.totalPriceLocator.textContent();
    return parseFloat(priceText?.replace(/[^\d.]/g, "") || "0");
  }

  // Proceed to the payment page
  public async proceedToPayment() {
    await this.cryptoPay.click();
    await this.confirmCrypto.click();
  }
}
