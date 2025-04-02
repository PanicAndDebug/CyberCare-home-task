import { test, expect } from "@playwright/test";
import {
  getHelpersEndpoint,
  testIPs,
  expectedResponses,
} from "../../utils/apiConstants";
import { validateIPResponse } from "../../utils/apiHelpers";

test.describe("API Testing - IP Insights", () => {
  test("Verify response structure", async ({ request }) => {
    const response = await request.get(getHelpersEndpoint);
    expect(response.status()).toBe(200);
    const data = await response.json();
    validateIPResponse(data);
  });

  test("Verify correct IP response", async ({ request }) => {
    const response = await request.get(
      `${getHelpersEndpoint}?ip=${testIPs.valid}`,
    );
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.ip).toBe(testIPs.valid);
    expect(data.country).toBe("Poland");
    expect(data.city).toBe("Warsaw");
  });

  test("Handle invalid IP gracefully", async ({ request }) => {
    const response = await request.get(
      `${getHelpersEndpoint}?ip=${testIPs.invalid}`,
    );
    expect(response.status()).toBe(400);
  });

  test("Verify ISP details", async ({ request }) => {
    const response = await request.get(
      `${getHelpersEndpoint}?ip=${testIPs.valid}`,
    );
    const data = await response.json();
    expect(data).toMatchObject({
      isp: expect.any(String),
      isp_asn: expect.any(Number),
    });
  });

  test("Verify protected status field", async ({ request }) => {
    const response = await request.get(
      `${getHelpersEndpoint}?ip=${testIPs.valid}`,
    );
    const data = await response.json();
    expect(typeof data.protected).toBe("boolean");
  });

  test("Check for missing IP parameter", async ({ request }) => {
    const response = await request.get(getHelpersEndpoint);
    expect(response.status()).toBe(200);
  });

  test("Check response time performance", async ({ request }) => {
    const start = Date.now();
    await request.get(`${getHelpersEndpoint}?ip=${testIPs.valid}`);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(2000);
  });

  test("Check for response with private IP", async ({ request }) => {
    const response = await request.get(
      `${getHelpersEndpoint}?ip=${testIPs.private}`,
    );
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toMatchObject(expectedResponses.private);
  });

  test("Check response with non-existent IP", async ({ request }) => {
    const response = await request.get(
      `${getHelpersEndpoint}?ip=${testIPs.nonExistent}`,
    );
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toMatchObject(expectedResponses.nonExistent);
  });

  test("Check response with IPv6 address", async ({ request }) => {
    const response = await request.get(
      `${getHelpersEndpoint}?ip=${testIPs.ipv6}`,
    );
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toMatchObject(expectedResponses.ipv6);
  });

  test("Verify geo accuracy for another region", async ({ request }) => {
    const response = await request.get(
      `${getHelpersEndpoint}?ip=${testIPs.googleDNS}`,
    );
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.country).toBe("United States");
  });
});
