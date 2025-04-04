import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "../pages/basePage";

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private planDropdown: Locator = this.page
    .getByTestId("order-summary-container")
    .getByRole("combobox");
  private preVatTotalLocator: Locator = this.page.getByTestId(
    "SelectedCartSummaryCard-total-price",
  );
  private vatLocator: Locator = this.page.getByTestId("TaxSelector-amount");
  private postVatTotalLocator: Locator = this.page.getByTestId(
    "CartSummary-total-amount",
  );

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

    expect(planPrice).toBeGreaterThanOrEqual(roundedExpectedPrice - 10);
    expect(planPrice).toBeLessThanOrEqual(roundedExpectedPrice + 10);
  }

  public async selectPlan(planName: string) {
    await this.planDropdown.click();
    const option = await this.page.getByRole("option", {
      name: new RegExp(planName, "i"),
    });
    await option.click();
  }

  private async parsePrice(priceLocator: Locator): Promise<number> {
    const priceText = await priceLocator.textContent();
    return parseFloat(priceText?.replace(/[^\d.]/g, "") ?? "0");
  }

  public async getTotalPreVat(): Promise<number> {
    return await this.parsePrice(this.preVatTotalLocator);
  }

  public async getVat(): Promise<number> {
    return await this.parsePrice(this.vatLocator);
  }

  public async getTotalPostVat(): Promise<number> {
    return await this.parsePrice(this.postVatTotalLocator);
  }
}
