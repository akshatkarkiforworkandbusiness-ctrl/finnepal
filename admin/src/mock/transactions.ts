import type { Transaction, TxChannel } from "@/types";
import { businesses } from "./businesses";

const channels: TxChannel[] = ["eSewa", "Khalti", "Bank", "Cash", "Other"];
const categories = ["Sales", "Refund", "Payout", "Supplier Payment", "Utility", "Payroll", "Inventory"];
const txStatusPattern: Transaction["status"][] = ["Completed", "Completed", "Completed", "Completed", "Pending", "Failed", "Completed", "Reversed", "Completed", "Flagged"];
const reconciliationPattern: Transaction["reconciliation"][] = ["Matched", "Matched", "Matched", "Pending", "Mismatch", "Matched", "Duplicate", "Matched", "Failed", "Matched"];

export const transactions: Transaction[] = Array.from({ length: 32 }).map((_, i) => {
  const b = businesses[i % businesses.length];
  const channel = channels[i % channels.length];
  const status = txStatusPattern[i % txStatusPattern.length];
  return {
    id: `TX-${829102 - i}`,
    date: `Aug ${18 - (i % 14)}, 2026`,
    businessId: b.id,
    business: b.name,
    provider: channel === "Cash" ? "Manual Entry" : channel,
    channel,
    type: i % 4 === 3 ? "Expense" : "Income",
    category: categories[i % categories.length],
    amount: 2500 + (i % 9) * 1450,
    status,
    source: channel === "Bank" ? "Bank Feed" : channel === "Cash" ? "Manual Entry" : "Provider API",
    reference: `DEMO-${channel.slice(0, 2).toUpperCase()}-${829102 - i}`,
    reconciliation: status === "Failed" ? "Failed" : reconciliationPattern[i % reconciliationPattern.length],
  };
});

export const getTransactionById = (id: string) => transactions.find((t) => t.id === id) ?? transactions[0];

export interface ChartPoint {
  label: string;
  transactions: number;
  volume: number;
  businesses: number;
}

export const transactionChartData: ChartPoint[] = [
  { label: "22 Jul", transactions: 15800, volume: 10.2, businesses: 6100 },
  { label: "29 Jul", transactions: 17200, volume: 11.6, businesses: 6400 },
  { label: "5 Aug", transactions: 16400, volume: 10.9, businesses: 6600 },
  { label: "12 Aug", transactions: 19100, volume: 13.4, businesses: 7100 },
  { label: "19 Aug", transactions: 18426, volume: 12.8, businesses: 8420 },
];

export const channelBreakdown = [
  { channel: "eSewa", count: 8240, percentage: 44.7 },
  { channel: "Khalti", count: 6920, percentage: 37.6 },
  { channel: "Bank", count: 3266, percentage: 17.7 },
  { channel: "Cash", count: 1210, percentage: 6.6 },
  { channel: "Other", count: 790, percentage: 4.3 },
];

export const transactionStatusBreakdown = [
  { status: "Successful", count: 17850, percentage: 96.9 },
  { status: "Pending", count: 342, percentage: 1.9 },
  { status: "Failed", count: 184, percentage: 1.0 },
  { status: "Reversed", count: 50, percentage: 0.3 },
  { status: "Flagged", count: 12, percentage: 0.1 },
];

export const dashboardKpis = {
  totalUsers: { value: "24,850", change: 8.4 },
  activeBusinesses: { value: "8,420", change: 5.7 },
  transactionsToday: { value: "18,426", sub: "NPR 12.8M" },
  connectedAccounts: { value: "5,218", change: 12.2 },
  monthlyTransactionValue: { value: "NPR 348.6M" },
  reconciliationRate: { value: "94.8%", change: 3.2 },
};
