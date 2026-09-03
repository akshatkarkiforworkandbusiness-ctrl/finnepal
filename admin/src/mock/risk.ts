import type { RiskAlert } from "@/types";

export const riskAlerts: RiskAlert[] = [
  { id: "RA-4821", level: "High", title: "Unusual transaction pattern", description: "Sudden 6x spike in transaction volume outside normal hours.", business: "Ram Electronics", time: "12 min ago", status: "Open" },
  { id: "RA-4820", level: "Medium", title: "Repeated failed connection", description: "5 consecutive provider connection failures on Bank.", business: "Sita Boutique", time: "48 min ago", status: "Investigating" },
  { id: "RA-4819", level: "Low", title: "Incomplete business profile", description: "Business verification documents pending for over 14 days.", business: "Gita Grocery", time: "3 hrs ago", status: "Open" },
  { id: "RA-4818", level: "Medium", title: "Consent nearing expiry", description: "Data-sharing consent expires in 3 days for a connected provider.", business: "Hari Hardware", time: "5 hrs ago", status: "Open" },
  { id: "RA-4817", level: "Low", title: "Stale sync window", description: "No successful sync recorded in the last 24 hours.", business: "Bina Tailors", time: "8 hrs ago", status: "Resolved" },
  { id: "RA-4816", level: "High", title: "Duplicate transaction cluster", description: "7 near-identical transactions submitted within 2 minutes.", business: "Deepak Motors", time: "10 hrs ago", status: "Investigating" },
];

export const riskStats = {
  active: riskAlerts.filter((r) => r.status !== "Resolved").length,
  high: riskAlerts.filter((r) => r.level === "High").length,
};
