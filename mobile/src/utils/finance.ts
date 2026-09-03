import { Transaction } from "@/types";

export interface FinanceSummary {
  income: number;
  expenses: number;
  net: number;
  digitalPayments: number;
  transactionCount: number;
}

export function summarize(transactions: Transaction[]): FinanceSummary {
  let income = 0;
  let expenses = 0;
  let digitalPayments = 0;
  for (const t of transactions) {
    if (t.type === "income") {
      income += t.amount;
      if (t.channel !== "Cash") digitalPayments += t.amount;
    } else {
      expenses += t.amount;
    }
  }
  return { income, expenses, net: income - expenses, digitalPayments, transactionCount: transactions.length };
}

/** Transactions dated on the given calendar day (defaults to today). */
export function forDay(transactions: Transaction[], day: Date = new Date()): Transaction[] {
  const key = day.toDateString();
  return transactions.filter((t) => new Date(t.date).toDateString() === key);
}

export interface CashFlowPoint {
  label: string;
  income: number;
  expense: number;
}

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Last-`days`-day cash flow series, bucketed by calendar day from actual transaction dates. */
export function dailySeries(transactions: Transaction[], days = 30, now: Date = new Date()): CashFlowPoint[] {
  const buckets: CashFlowPoint[] = [];
  const dayKeys: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    dayKeys.push(d.toDateString());
    buckets.push({ label: `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`, income: 0, expense: 0 });
  }
  for (const t of transactions) {
    const key = new Date(t.date).toDateString();
    const idx = dayKeys.indexOf(key);
    if (idx === -1) continue;
    if (t.type === "income") buckets[idx].income += t.amount;
    else buckets[idx].expense += t.amount;
  }
  return buckets;
}

/** Change vs. the same-length period immediately before `since` — safe with zero baselines. */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}
