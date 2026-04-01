const SDK_NAME = "@valyu/ai-sdk";
const SDK_VERSION = "1.1.4";
const BASE_URL = "https://api.valyu.ai/v1";

const sdkHeaders = {
  "User-Agent": `valyu-ai-sdk/${SDK_VERSION}`,
  "X-Valyu-SDK": "valyu-ai-sdk",
  "X-Valyu-SDK-Version": SDK_VERSION,
};

export { BASE_URL };

export function valyuFetch(
  endpoint: string,
  apiKey: string,
  options: { method?: string; body?: string; contentType?: boolean } = {}
): Promise<Response> {
  const { method = "POST", body, contentType = true } = options;
  return fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      ...(contentType && { "Content-Type": "application/json" }),
      "x-api-key": apiKey,
      ...sdkHeaders,
    },
    ...(body && { body }),
  });
}
