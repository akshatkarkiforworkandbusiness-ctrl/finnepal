import type { ActivityItem } from "@/types";

export const recentActivity: ActivityItem[] = [
  { id: "a1", time: "08:32", user: "Amit", business: "Amit Mobile Store", event: "Transaction synced", provider: "Khalti", status: "Success" },
  { id: "a2", time: "08:29", user: "Sita", business: "Sita Boutique", event: "Provider connected", provider: "eSewa", status: "Success" },
  { id: "a3", time: "08:24", user: "Ram", business: "Ram Electronics", event: "Sync failed", provider: "Bank", status: "Warning" },
  { id: "a4", time: "08:19", user: "Gita", business: "Gita Grocery", event: "Consent granted", provider: "eSewa", status: "Success" },
  { id: "a5", time: "08:11", user: "Hari", business: "Hari Hardware", event: "Transaction synced", provider: "eSewa", status: "Success" },
  { id: "a6", time: "08:04", user: "Bina", business: "Bina Tailors", event: "Provider disconnected", provider: "Khalti", status: "Failed" },
];
