import { Transaction, TransactionChannel } from "@/types";

export type Period = "thisMonth" | "lastMonth" | "all";

function monthKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

export function filterByPeriod(transactions: Transaction[], period: Period, now: Date = new Date()): Transaction[] {
  if (period === "all") return transactions;
  const target = new Date(now);
  if (period === "lastMonth") target.setMonth(target.getMonth() - 1);
  const key = monthKey(target);
  return transactions.filter((t) => monthKey(new Date(t.date)) === key);
}

export interface BreakdownSlice {
  key: string;
  label: string;
  amount: number;
  percent: number;
}

function breakdownBy(transactions: Transaction[], keyFn: (t: Transaction) => string): BreakdownSlice[] {
  const totals = new Map<string, number>();
  let total = 0;
  for (const t of transactions) {
    const key = keyFn(t);
    totals.set(key, (totals.get(key) ?? 0) + t.amount);
    total += t.amount;
  }
  return Array.from(totals.entries())
    .map(([key, amount]) => ({ key, label: key, amount, percent: total > 0 ? (amount / total) * 100 : 0 }))
    .sort((a, b) => b.amount - a.amount);
}

/** Sales by product category — sums income transactions by categoryName. */
export function incomeCategoryBreakdown(transactions: Transaction[]): BreakdownSlice[] {
  return breakdownBy(
    transactions.filter((t) => t.type === "income"),
    (t) => t.categoryName
  );
}

/** Expenses by category — sums expense transactions by categoryName ("Uncategorized" preserved if present). */
export function expenseCategoryBreakdown(transactions: Transaction[]): BreakdownSlice[] {
  return breakdownBy(
    transactions.filter((t) => t.type === "expense"),
    (t) => t.categoryName
  );
}

export function channelBreakdown(transactions: Transaction[], type?: "income" | "expense"): BreakdownSlice[] {
  const source = type ? transactions.filter((t) => t.type === type) : transactions;
  return breakdownBy(source, (t) => t.channel as TransactionChannel);
}

export interface CustomerConcentration {
  hasCustomerData: boolean;
  top1Percent: number;
  top3Percent: number;
  top5Percent: number;
  topCustomerName?: string;
}

/** Only meaningful when at least some income transactions carry a customerId. */
export function customerConcentration(transactions: Transaction[]): CustomerConcentration {
  const income = transactions.filter((t) => t.type === "income" && t.customerId);
  if (income.length === 0) {
    return { hasCustomerData: false, top1Percent: 0, top3Percent: 0, top5Percent: 0 };
  }
  const totals = new Map<string, { name: string; amount: number }>();
  let totalRevenue = 0;
  for (const t of transactions.filter((t) => t.type === "income")) {
    totalRevenue += t.amount;
    if (!t.customerId) continue;
    const existing = totals.get(t.customerId);
    totals.set(t.customerId, { name: t.customerName ?? t.customerId, amount: (existing?.amount ?? 0) + t.amount });
  }
  const sorted = Array.from(totals.values()).sort((a, b) => b.amount - a.amount);
  const sumTop = (n: number) => sorted.slice(0, n).reduce((s, c) => s + c.amount, 0);
  return {
    hasCustomerData: true,
    top1Percent: totalRevenue > 0 ? (sumTop(1) / totalRevenue) * 100 : 0,
    top3Percent: totalRevenue > 0 ? (sumTop(3) / totalRevenue) * 100 : 0,
    top5Percent: totalRevenue > 0 ? (sumTop(5) / totalRevenue) * 100 : 0,
    topCustomerName: sorted[0]?.name,
  };
}

export interface CashFlowTotals {
  income: number;
  expenses: number;
  net: number;
}

export function cashFlowTotals(transactions: Transaction[]): CashFlowTotals {
  let income = 0;
  let expenses = 0;
  for (const t of transactions) {
    if (t.type === "income") income += t.amount;
    else expenses += t.amount;
  }
  return { income, expenses, net: income - expenses };
}

/** Undefined when there's no income to divide by (avoids fabricating a ratio). */
export function expenseToIncomeRatio(transactions: Transaction[]): number | undefined {
  const { income, expenses } = cashFlowTotals(transactions);
  if (income === 0) return undefined;
  return expenses / income;
}

export interface MonthComparison {
  available: boolean;
  currentIncome: number;
  previousIncome: number;
  currentExpenses: number;
  previousExpenses: number;
  incomeChangePercent?: number;
  expenseChangePercent?: number;
  netChangePercent?: number;
}

/** Current complete-enough month vs. the previous month; requires data in both. */
export function monthOverMonthChange(transactions: Transaction[], now: Date = new Date()): MonthComparison {
  const current = cashFlowTotals(filterByPeriod(transactions, "thisMonth", now));
  const previous = cashFlowTotals(filterByPeriod(transactions, "lastMonth", now));
  const hasBoth = (current.income > 0 || current.expenses > 0) && (previous.income > 0 || previous.expenses > 0);
  if (!hasBoth) {
    return { available: false, currentIncome: current.income, previousIncome: previous.income, currentExpenses: current.expenses, previousExpenses: previous.expenses };
  }
  const pct = (a: number, b: number) => (b === 0 ? undefined : ((a - b) / b) * 100);
  return {
    available: true,
    currentIncome: current.income,
    previousIncome: previous.income,
    currentExpenses: current.expenses,
    previousExpenses: previous.expenses,
    incomeChangePercent: pct(current.income, previous.income),
    expenseChangePercent: pct(current.expenses, previous.expenses),
    netChangePercent: pct(current.net, previous.net),
  };
}

export interface VolatilityResult {
  available: boolean;
  monthsOfHistory: number;
  coefficientOfVariation?: number;
}

/** Coefficient of variation of monthly revenue — only computed with 3+ distinct months of income. */
export function revenueVolatility(transactions: Transaction[]): VolatilityResult {
  const monthTotals = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== "income") continue;
    const key = monthKey(new Date(t.date));
    monthTotals.set(key, (monthTotals.get(key) ?? 0) + t.amount);
  }
  const values = Array.from(monthTotals.values());
  if (values.length < 3) return { available: false, monthsOfHistory: values.length };
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  if (mean === 0) return { available: false, monthsOfHistory: values.length };
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  const stdDev = Math.sqrt(variance);
  return { available: true, monthsOfHistory: values.length, coefficientOfVariation: (stdDev / mean) * 100 };
}

export interface MonthPoint {
  label: string;
  income: number;
  expense: number;
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Last `months` calendar months (oldest first), including the current month. */
export function monthlySeries(transactions: Transaction[], months = 6, now: Date = new Date()): MonthPoint[] {
  const buckets: MonthPoint[] = [];
  const keys: string[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(monthKey(d));
    buckets.push({ label: MONTH_LABELS[d.getMonth()], income: 0, expense: 0 });
  }
  for (const t of transactions) {
    const idx = keys.indexOf(monthKey(new Date(t.date)));
    if (idx === -1) continue;
    if (t.type === "income") buckets[idx].income += t.amount;
    else buckets[idx].expense += t.amount;
  }
  return buckets;
}

export function topTransactions(transactions: Transaction[], type: "income" | "expense", count = 5): Transaction[] {
  return transactions
    .filter((t) => t.type === type)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, count);
}
