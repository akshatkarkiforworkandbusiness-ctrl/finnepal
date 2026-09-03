import type { CashFlowPoint } from "@/types";

export const cashFlowData: CashFlowPoint[] = [
  { label: "Mar", income: 82.4, expense: 58.1, net: 24.3 },
  { label: "Apr", income: 88.1, expense: 61.4, net: 26.7 },
  { label: "May", income: 91.6, expense: 64.8, net: 26.8 },
  { label: "Jun", income: 97.2, expense: 68.3, net: 28.9 },
  { label: "Jul", income: 104.5, expense: 72.6, net: 31.9 },
  { label: "Aug", income: 112.8, expense: 76.4, net: 36.4 },
];

export const cashFlowStats = {
  totalIncome: 576600000,
  totalExpense: 401600000,
  netCashFlow: 175000000,
};
