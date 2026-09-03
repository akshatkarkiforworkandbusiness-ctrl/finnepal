import type { Consent } from "@/types";
import { businesses } from "./businesses";

const purposes = [
  "Transaction aggregation",
  "Financial analytics",
  "Tally synchronization",
  "Loan package generation",
  "Insurance discovery",
];

export const consents: Consent[] = businesses.map((b, i) => ({
  id: `CNS-${5001 + i}`,
  user: b.owner,
  business: b.name,
  provider: (["eSewa", "Khalti", "Bank", "Cash"] as const)[i % 4],
  scope: (["Transactions, Balance", "Transactions", "Balance, Profile", "Transactions, Profile"] as string[])[i % 4],
  purpose: purposes[i % purposes.length],
  status: (["Granted", "Granted", "Granted", "Pending", "Revoked", "Expired"] as Consent["status"][])[i % 6],
  granted: `Aug ${10 - (i % 8)}, 2026`,
  expires: `Feb ${10 - (i % 8)}, 2027`,
}));

export const consentStats = {
  active: consents.filter((c) => c.status === "Granted").length,
  expired: consents.filter((c) => c.status === "Expired").length,
  revoked: consents.filter((c) => c.status === "Revoked").length,
  pending: consents.filter((c) => c.status === "Pending").length,
};
