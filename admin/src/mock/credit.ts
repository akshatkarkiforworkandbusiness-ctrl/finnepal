import type { CreditProfile } from "@/types";
import { businesses } from "./businesses";

const statusPattern: CreditProfile["status"][] = ["Profile Ready", "Incomplete Data", "Consent Required", "Profile Ready", "Review Required", "Incomplete Data"];

export const creditProfiles: CreditProfile[] = businesses.map((b, i) => {
  const status = statusPattern[i % statusPattern.length];
  return {
    id: `CRD-${7001 + i}`,
    businessId: b.id,
    business: b.name,
    status,
    dataCoverage: status === "Profile Ready" ? 92 - (i % 5) : status === "Incomplete Data" ? 48 - (i % 10) : 61 - (i % 8),
    consentStatus: b.consentStatus,
    monthsOfHistory: status === "Profile Ready" ? 12 - (i % 4) : 4 + (i % 4),
    lenderRequests: i % 4,
    prototypeScore: status === "Profile Ready" ? 620 + (i * 13) % 180 : null,
    lastUpdated: `Aug ${14 - (i % 10)}, 2026`,
  };
});

export const getCreditProfileById = (id: string) => creditProfiles.find((c) => c.id === id) ?? creditProfiles[0];

export const creditStats = {
  completedHistory: creditProfiles.filter((c) => c.status === "Profile Ready").length,
  consentedData: creditProfiles.filter((c) => c.consentStatus === "Granted").length,
  loanPackageRequests: creditProfiles.reduce((sum, c) => sum + c.lenderRequests, 0),
  partnerLenderRequests: 14,
};
