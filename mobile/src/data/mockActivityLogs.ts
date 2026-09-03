import { ActivityLogEntry } from "@/types";

export const ACTIVITY_LOG: ActivityLogEntry[] = [
  { id: "a1", label: "Tally sync completed", time: "Today - 6:32 PM" },
  { id: "a2", label: "Financial profile viewed", time: "Today - 4:15 PM" },
  { id: "a3", label: "eSewa connection updated", time: "Yesterday" },
  { id: "a4", label: "Financial profile shared with Nabil Bank Ltd.", time: "18 Aug" },
  { id: "a5", label: "New device login - Kathmandu", time: "16 Aug" },
  { id: "a6", label: "Khalti connected", time: "12 Aug" },
  { id: "a7", label: "Reconciliation reviewed - 3 items", time: "10 Aug" },
];

export const NOTIFICATION_SETTINGS = [
  { id: "n1", label: "Transaction alerts", enabled: true },
  { id: "n2", label: "Security alerts", enabled: true },
  { id: "n3", label: "Reconciliation reminders", enabled: true },
  { id: "n4", label: "Financial insights", enabled: true },
  { id: "n5", label: "Tally sync notifications", enabled: true },
];

export const RECENT_SECURITY_ACTIVITY = ACTIVITY_LOG.slice(0, 3).map((a) => ({ id: a.id, label: a.label, time: a.time }));
