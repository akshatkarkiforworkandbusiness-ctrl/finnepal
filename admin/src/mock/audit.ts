import type { AuditEvent } from "@/types";

export const auditEvents: AuditEvent[] = [
  { id: "AUD-9001", time: "Aug 18, 2026 · 08:32", actor: "Orbit Admin", action: "Viewed transaction record", target: "TX-829102", targetType: "Transaction", ip: "103.10.24.18", result: "Success", category: "Access" },
  { id: "AUD-9000", time: "Aug 18, 2026 · 08:20", actor: "Priya (Compliance)", action: "Approved KYC submission", target: "USR-1003", targetType: "User", ip: "103.10.24.9", result: "Success", category: "Security" },
  { id: "AUD-8999", time: "Aug 18, 2026 · 07:58", actor: "System", action: "Generated Tally export", target: "BIZ-2004", targetType: "Business", ip: "internal", result: "Success", category: "Data" },
  { id: "AUD-8998", time: "Aug 18, 2026 · 07:41", actor: "Orbit Admin", action: "Changed business status", target: "BIZ-2005", targetType: "Business", ip: "103.10.24.18", result: "Success", category: "Security" },
  { id: "AUD-8997", time: "Aug 18, 2026 · 07:22", actor: "Rohan (Ops)", action: "Reviewed reconciliation", target: "TX-829099", targetType: "Transaction", ip: "103.10.24.31", result: "Success", category: "Config" },
  { id: "AUD-8996", time: "Aug 18, 2026 · 06:50", actor: "System", action: "Revoked expired integration", target: "CNS-5007", targetType: "Consent", ip: "internal", result: "Success", category: "Data" },
  { id: "AUD-8995", time: "Aug 18, 2026 · 06:33", actor: "Orbit Admin", action: "Exported business report", target: "BIZ-2003", targetType: "Business", ip: "103.10.24.18", result: "Success", category: "Access" },
  { id: "AUD-8994", time: "Aug 18, 2026 · 06:10", actor: "Priya (Compliance)", action: "Rejected KYC submission", target: "USR-1007", targetType: "User", ip: "103.10.24.9", result: "Success", category: "Security" },
  { id: "AUD-8993", time: "Aug 18, 2026 · 05:44", actor: "System", action: "Failed login attempt blocked", target: "admin@orbit.demo", targetType: "Admin User", ip: "45.132.10.4", result: "Failed", category: "Security" },
];

export const auditStats = {
  today: 1248,
};
