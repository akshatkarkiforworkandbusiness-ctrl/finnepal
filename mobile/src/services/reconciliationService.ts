import { ReconciliationStatus, Transaction } from "@/types";

export interface ReconciliationSummary {
  matched: number;
  pending: number;
  mismatched: number;
  total: number;
  matchedPercent: number;
}

export function reconciliationSummary(transactions: Transaction[]): ReconciliationSummary {
  let matched = 0;
  let pending = 0;
  let mismatched = 0;
  for (const t of transactions) {
    if (t.reconciliationStatus === "matched") matched++;
    else if (t.reconciliationStatus === "pending") pending++;
    else mismatched++;
  }
  const total = transactions.length;
  return { matched, pending, mismatched, total, matchedPercent: total > 0 ? Math.round((matched / total) * 100) : 0 };
}

export function byReconciliationStatus(transactions: Transaction[], status: ReconciliationStatus): Transaction[] {
  return transactions.filter((t) => t.reconciliationStatus === status);
}

export interface TallyReconciliationSummary {
  matched: number;
  needsReview: number;
  failed: number;
}

/** Tally-specific view: compares each synced transaction's Orbit amount against its Tally amount. */
export function tallyReconciliationSummary(transactions: Transaction[]): TallyReconciliationSummary {
  const synced = transactions.filter((t) => t.tallyStatus === "synced" && t.tallyAmount !== undefined);
  const matched = synced.filter((t) => t.tallyAmount === t.amount).length;
  const needsReview = synced.filter((t) => t.tallyAmount !== undefined && t.tallyAmount !== t.amount).length;
  return { matched, needsReview, failed: 0 };
}

export function tallyMismatches(transactions: Transaction[]): Transaction[] {
  return transactions.filter((t) => t.tallyAmount !== undefined && t.tallyAmount !== t.amount);
}
