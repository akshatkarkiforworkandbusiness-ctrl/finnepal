import { TallySyncState } from "@/types";

export const TALLY_SYNC: TallySyncState = {
  connected: true,
  lastSync: "20 Aug 2026 · 6:32 PM",
  orbitToTally: { transactions: 38, ledgers: 6, vouchers: 24 },
  tallyToOrbit: { records: 31, needsReview: 3 },
  steps: [
    { id: "prepare", label: "Preparing transactions", done: true },
    { id: "ledgers", label: "Resolving ledgers", done: true },
    { id: "vouchers", label: "Generating vouchers", done: true },
    { id: "send", label: "Sending to Tally", done: true },
    { id: "process", label: "Processing response", done: true },
    { id: "complete", label: "Sync complete", done: true },
  ],
};

export const TALLY_XML_SUMMARY = {
  ledgers: 6,
  salesVouchers: 18,
  paymentVouchers: 6,
  bankVouchers: 10,
};
