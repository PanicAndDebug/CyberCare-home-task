import { test, expect } from "@playwright/test";
import { ProductsPage } from "../../pages/productsPage";
import { LoginPage } from "../../pages/loginPage";
import { CheckoutPage } from "../../pages/checkoutPage";
import { CryptoPaymentPage } from "../../pages/cryptoPaymentPage";
import { exchangeEurToUsd } from "../../utils/uiHelpers";
import { exchangeRate, email } from "../../utils/uiConstants";

test.describe("NordVPN Checkout Flow", () => {
  let productsPage: ProductsPage;
  let loginPage: LoginPage;
  let checkoutPage: CheckoutPage;
  let cryptoPaymentPage: CryptoPaymentPage;

  // Setup before each test
  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    loginPage = new LoginPage(page);
    checkoutPage = new CheckoutPage(page);
    cryptoPaymentPage = new CryptoPaymentPage(page);

    // Navigate to the products page before each test
    await productsPage.navigate();
  });

  test("Validate pricing by checking discount over base monthly price", async () => {
    await productsPage.clickBuyNordVPN();

    //Validate login page
    await productsPage.clickLogin();
    await loginPage.verifyLoginPage();

    // Validate pricing
    await checkoutPage.comparePlanWithMonthly("1-year plan");
  });

  test.skip("Validate pricing by checking selected plan price over crypto checkout estimated price", async () => {
    await productsPage.clickBuyNordVPN();
    await productsPage.clickLogin();
    await loginPage.verifyLoginPage();
    await checkoutPage.selectPlan("1-year plan");

    const totalPriceInEur = await checkoutPage.getTotalPricePostVat();
    await checkoutPage.enterEmail(email);
    await checkoutPage.proceedToCryptoPayment();

    const totalPriceInUsd = await cryptoPaymentPage.getTotalPrice();
    const expectedPriceInUsd = exchangeEurToUsd(totalPriceInEur, exchangeRate);

    expect(totalPriceInUsd).toBeCloseTo(expectedPriceInUsd, 0.1);
  });
});
