import { expect } from "@playwright/test";

export function validateIPResponse(data: any) {
  expect(data).toMatchObject({
    ip: expect.any(String),
    country: expect.any(String),
    city: expect.any(String),
    isp: expect.any(String),
    latitude: expect.any(Number),
    longitude: expect.any(Number),
    protected: expect.any(Boolean),
  });
}
