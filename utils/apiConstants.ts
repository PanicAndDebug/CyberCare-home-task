export const ENDPOINT = "/v1/helpers/ips/insights";

export const testIPs = {
  valid: "45.128.38.232",
  invalid: "999.999.999.999",
  private: "192.168.1.1",
  nonExistent: "0.0.0.0",
  ipv6: "2001:db8::ff00:42:8329",
  googleDNS: "8.8.8.8",
};

const generateExpectedResponse = (ip: string) => ({
  ip,
  country: "Unknown",
  country_code: "Unknown",
  city: "Unknown",
  isp: "Unknown",
  isp_asn: "Unknown",
  protected: false,
  longitude: false,
  latitude: false,
  state_code: "Unknown",
  zip_code: "Unknown",
});

export const expectedResponses = {
  private: generateExpectedResponse(testIPs.private),
  nonExistent: generateExpectedResponse(testIPs.nonExistent),
  ipv6: generateExpectedResponse(testIPs.ipv6),
};
