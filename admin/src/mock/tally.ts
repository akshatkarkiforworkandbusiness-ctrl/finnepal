import type { TallyConnection, TallySyncLog } from "@/types";
import { businesses } from "./businesses";

export const tallyConnections: TallyConnection[] = businesses
  .filter((b) => b.tallyConnected)
  .map((b, i) => ({
    id: `TLY-${8001 + i}`,
    business: b.name,
    status: (["Synced", "Synced", "Synced", "Pending", "Failed"] as TallyConnection["status"][])[i % 5],
    lastSync: i === 0 ? "3 min ago" : `${i * 11 + 5} min ago`,
    vouchersSynced: 240 - i * 12,
    ledgersSynced: 18 - (i % 6),
    errors: i % 5 === 4 ? 2 : 0,
  }));

export const tallySyncLogs: TallySyncLog[] = Array.from({ length: 14 }).map((_, i) => {
  const b = businesses[i % businesses.length];
  const type = (["Sales", "Payment", "Ledger", "Bank"] as TallySyncLog["type"][])[i % 4];
  const hasError = i % 6 === 5;
  const status: TallySyncLog["status"] = hasError ? "LINEERROR" : i % 9 === 8 ? "ERROR" : "SUCCESS";
  return {
    id: `SYNC-${90210 - i}`,
    business: b.name,
    type,
    records: 8 + (i % 12),
    started: `Aug 18, 2026 · ${String(9 - (i % 9)).padStart(2, "0")}:1${i % 6}`,
    completed: `Aug 18, 2026 · ${String(9 - (i % 9)).padStart(2, "0")}:1${(i % 6) + 2}`,
    status,
    summary:
      status === "SUCCESS"
        ? `${14 - (i % 6)} Sales vouchers created, ${2 + (i % 3)} Payment vouchers created, ${3 - (i % 3)} Ledgers created`
        : status === "LINEERROR"
          ? "Voucher created with line-level warnings"
          : "Sync failed — Tally connection timed out",
    lineErrors: hasError
      ? [`Line 4: Ledger "Sundry Debtors – ${b.name}" not found, auto-created.`, "Line 9: Amount rounding mismatch of NPR 0.50 auto-adjusted."]
      : [],
  };
});

export const getSyncLogById = (id: string) => tallySyncLogs.find((l) => l.id === id) ?? tallySyncLogs[0];

export const tallyStats = {
  connectedBusinesses: tallyConnections.length,
  totalVouchers: tallyConnections.reduce((s, c) => s + c.vouchersSynced, 0),
  totalLedgers: tallyConnections.reduce((s, c) => s + c.ledgersSynced, 0),
  failedSyncs: tallyConnections.filter((c) => c.status === "Failed").length,
};
