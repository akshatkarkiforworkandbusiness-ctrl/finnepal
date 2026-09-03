import type { OrbitNotification } from "@/types";

export const notifications: OrbitNotification[] = [
  { id: "n1", type: "transaction", severity: "High", title: "High number of failed payments", description: "23 failed payments in the last 30 minutes.", time: "10m ago", status: "Unread" },
  { id: "n2", type: "kyc", severity: "Medium", title: "KYC verification pending", description: "112 KYC applications require review.", time: "25m ago", status: "Unread" },
  { id: "n3", type: "sync", severity: "High", title: "Tally sync error", description: "3 businesses failed to sync with Tally Prime.", time: "1h ago", status: "Unread" },
  { id: "n4", type: "risk", severity: "Low", title: "New consent requests", description: "28 businesses requested data sharing.", time: "2h ago", status: "Read" },
  { id: "n5", type: "system", severity: "Low", title: "System backup completed", description: "Daily backup completed successfully.", time: "3h ago", status: "Resolved" },
  { id: "n6", type: "security", severity: "Critical", title: "Suspicious login attempt", description: "5 failed login attempts from an unrecognized device.", time: "4h ago", status: "Unread" },
  { id: "n7", type: "sync", severity: "Medium", title: "Reconciliation mismatch", description: "14 transactions could not be auto-matched with provider records.", time: "6h ago", status: "Read" },
  { id: "n8", type: "kyc", severity: "Low", title: "KYC batch approved", description: "42 KYC submissions verified and approved.", time: "9h ago", status: "Resolved" },
];
