import type { KycRecord } from "@/types";
import { businesses } from "./businesses";
import { users } from "./users";

export const kycRecords: KycRecord[] = users.map((u, i) => {
  const b = businesses[i % businesses.length];
  const reviewedIdx = i % 5;
  return {
    id: `KYC-${6001 + i}`,
    user: u.name,
    business: b.name,
    status: u.kyc,
    submitted: `Aug ${14 - (i % 10)}, 2026`,
    reviewed: u.kyc === "Pending" ? null : `Aug ${16 - (i % 10)}, 2026`,
    reviewer: u.kyc === "Pending" ? null : (["Priya (Compliance)", "Rohan (Ops)", "Orbit Admin"] as string[])[reviewedIdx % 3],
  };
});

export const kycStats = {
  verified: 21840,
  pending: 1126,
  rejected: 84,
  reviewRequired: 112,
};
