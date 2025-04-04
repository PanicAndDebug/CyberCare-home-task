import { test, expect } from "@playwright/test";
import { ProductsPage } from "../../pages/productsPage";
import { LoginPage } from "../../pages/loginPage";
import { CheckoutPage } from "../../pages/checkoutPage";

test.describe("NordVPN Checkout Flow", () => {
  let productsPage: ProductsPage;
  let loginPage: LoginPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    loginPage = new LoginPage(page);
    checkoutPage = new CheckoutPage(page);
    await productsPage.navigate();
  });

  //This is the validation as per updated requirements
  test("Validate that the total cart price equals the pre-tax price plus VAT", async () => {
    await productsPage.clickBuyNordVPN();
    await productsPage.clickLogin();
    await loginPage.verifyLoginPage();
    await checkoutPage.selectPlan("1-year plan");

    const preVat = await checkoutPage.getTotalPreVat();
    const vat = await checkoutPage.getVat();
    const postVat = await checkoutPage.getTotalPostVat();

    expect(postVat).toEqual(preVat + vat);
  });

  // This test checks if the selected annual plan price matches the expected monthly plan price,
  // factoring in the declared discount amount on the annual plan.
  // Although the prices don’t match exactly, there might be a business reason behind this discrepancy,
  // the lack of which would indicate bug.
  test("Validate pricing by checking discount over base monthly price", async () => {
    await productsPage.clickBuyNordVPN();
    await productsPage.clickLogin();
    await loginPage.verifyLoginPage();
    await checkoutPage.comparePlanWithMonthly("1-year plan");
  });
});
