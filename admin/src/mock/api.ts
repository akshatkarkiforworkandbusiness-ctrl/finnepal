import type { ApiEndpoint, ApiLogEntry } from "@/types";

export const apiServices = [
  "Transactions API",
  "Businesses API",
  "Users API",
  "Consent API",
  "Analytics API",
  "Tally API",
  "Payment Integration API",
];

export const apiEndpoints: ApiEndpoint[] = [
  { method: "GET", path: "/api/v1/businesses", service: "Businesses API", description: "List businesses" },
  { method: "POST", path: "/api/v1/transactions", service: "Transactions API", description: "Create a transaction" },
  { method: "GET", path: "/api/v1/transactions", service: "Transactions API", description: "List transactions" },
  { method: "GET", path: "/api/v1/users", service: "Users API", description: "List users" },
  { method: "GET", path: "/api/v1/consent", service: "Consent API", description: "List active consents" },
  { method: "POST", path: "/api/v1/tally/sync", service: "Tally API", description: "Trigger a Tally sync" },
  { method: "GET", path: "/api/v1/analytics/summary", service: "Analytics API", description: "Platform analytics summary" },
];

export const apiLogs: ApiLogEntry[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `LOG-${40210 - i}`,
  time: `Aug 18, 2026 · 08:${String(40 - i * 3).padStart(2, "0")}`,
  method: (["GET", "GET", "POST", "GET"] as const)[i % 4],
  path: apiEndpoints[i % apiEndpoints.length].path,
  status: i % 7 === 6 ? 502 : i % 5 === 4 ? 429 : 200,
  latencyMs: 80 + (i % 6) * 34,
}));

export const apiStatus = {
  environment: "SANDBOX" as const,
  version: "v1",
  apiKeyStatus: "Active" as const,
  webhookStatus: "Operational" as const,
};
