import type { ReconciliationRecord } from "@/types";
import { transactions } from "./transactions";

export const reconciliationRecords: ReconciliationRecord[] = transactions.map((t) => ({
  id: `REC-${t.id.split("-")[1]}`,
  transactionId: t.id,
  business: t.business,
  source: t.source,
  amount: t.amount,
  date: t.date,
  status: t.reconciliation,
  matchedWith: t.reconciliation === "Matched" ? `${t.provider} Statement Entry` : t.reconciliation === "Duplicate" ? `${t.id}-DUP` : "—",
}));

export const reconciliationStats = {
  matched: reconciliationRecords.filter((r) => r.status === "Matched").length,
  pending: reconciliationRecords.filter((r) => r.status === "Pending").length,
  mismatch: reconciliationRecords.filter((r) => r.status === "Mismatch").length,
  duplicate: reconciliationRecords.filter((r) => r.status === "Duplicate").length,
  failed: reconciliationRecords.filter((r) => r.status === "Failed").length,
  rate: 94.8,
};
