import { test, expect } from "@playwright/test";
import { ProductsPage } from "../../pages/productsPage";
import { LoginPage } from "../../pages/loginPage";
import { CheckoutPage } from "../../pages/checkoutPage";
import { CryptoPaymentPage } from "../../pages/cryptoPaymentPage";

test.describe("NordVPN Checkout Flow", () => {
  test("Validate pricing by checking discount over base monthly price", async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);
    const loginPage = new LoginPage(page);
    const checkoutPage = new CheckoutPage(page);
    const cryptoPaymentPage = new CryptoPaymentPage(page);
    await productsPage.navigate();
    await productsPage.clickBuyNordVPN();
    await productsPage.clickLogin();
    await loginPage.verifyLoginPage();

    // Validate pricing
    await checkoutPage.comparePlanWithMonthly("1-year plan");

    // Proceed to payment
    await checkoutPage.proceedToPayment();

    // Get the price in USD from the payment page
    const priceInUSD = await cryptoPaymentPage.getPriceInUSD();
    console.log("Price in USD:", priceInUSD);

    // Assert that the price matches the expected value (adjust as needed)
    const expectedPriceInUSD = 86.07;
    expect(priceInUSD).toBeCloseTo(expectedPriceInUSD, 0.01);
  });
});
