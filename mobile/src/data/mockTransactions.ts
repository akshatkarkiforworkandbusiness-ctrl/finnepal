import { ProviderId, ReconciliationStatus, TallyStatus, Transaction, TransactionChannel, TransactionStatus, TransactionType } from "@/types";

import { BUSINESS } from "./mockBusiness";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "./mockCategories";
import { CUSTOMERS } from "./mockCustomers";

const CHANNEL_PROVIDER: Record<TransactionChannel, ProviderId> = {
  Bank: "nabil",
  eSewa: "esewa",
  Khalti: "khalti",
  Cash: "cash",
  Tally: "tally",
  Other: "cash",
};

const BANK_PROVIDERS: ProviderId[] = ["nabil", "nicasia", "gibl"];

let seq = 1;
function nextId() {
  return `t${seq++}`;
}
function nextRef() {
  return `ORB-TXN-${(88000 + seq).toString()}`;
}

function makeTx(input: {
  type: TransactionType;
  amount: number;
  categoryId: string;
  channel: TransactionChannel;
  date: string;
  description: string;
  customerId?: string;
  note?: string;
  status?: TransactionStatus;
  reconciliationStatus?: ReconciliationStatus;
  tallyStatus?: TallyStatus;
  tallyAmount?: number;
  provider?: ProviderId;
}): Transaction {
  const category = (input.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).find((c) => c.id === input.categoryId);
  const provider =
    input.provider ??
    (input.channel === "Bank" ? BANK_PROVIDERS[seq % BANK_PROVIDERS.length] : CHANNEL_PROVIDER[input.channel]);
  return {
    id: nextId(),
    businessId: BUSINESS.id,
    type: input.type,
    amount: input.amount,
    currency: "NPR",
    categoryId: input.categoryId,
    categoryName: category?.name ?? "Other",
    channel: input.channel,
    provider,
    customerId: input.customerId,
    customerName: input.customerId ? CUSTOMERS.find((c) => c.id === input.customerId)?.name : undefined,
    date: input.date,
    note: input.note,
    description: input.description,
    status: input.status ?? "completed",
    reference: nextRef(),
    reconciliationStatus: input.reconciliationStatus ?? "matched",
    tallyStatus: input.tallyStatus ?? "synced",
    tallyAmount: input.tallyAmount,
    verified: (input.status ?? "completed") !== "flagged",
  };
}

/** Today (2026-08-20) — curated so Home's "Today's overview" totals are exact and internally consistent. */
const TODAY = "2026-08-20";
const TODAY_TRANSACTIONS: Transaction[] = [
  makeTx({ type: "income", amount: 2500, categoryId: "beverages", channel: "Khalti", date: `${TODAY}T10:05:00`, description: "Khalti Payment", customerId: "c5", reconciliationStatus: "matched", tallyStatus: "synced", tallyAmount: 2500 }),
  makeTx({ type: "income", amount: 5000, categoryId: "groceries", channel: "Bank", date: `${TODAY}T09:40:00`, description: "Nabil Bank Deposit", customerId: "c1", provider: "nabil", reconciliationStatus: "pending", tallyStatus: "pending" }),
  makeTx({ type: "income", amount: 3450, categoryId: "household", channel: "eSewa", date: `${TODAY}T08:55:00`, description: "eSewa Payment", customerId: "c5", reconciliationStatus: "matched", tallyStatus: "synced", tallyAmount: 3450 }),
  makeTx({ type: "income", amount: 45000, categoryId: "groceries", channel: "Bank", date: `${TODAY}T11:20:00`, description: "Wholesale Order Payment", customerId: "c4", provider: "nicasia", reconciliationStatus: "matched", tallyStatus: "synced", tallyAmount: 45000 }),
  makeTx({ type: "income", amount: 12000, categoryId: "beverages", channel: "Khalti", date: `${TODAY}T12:10:00`, description: "Catering Order Payment", customerId: "c2", reconciliationStatus: "matched", tallyStatus: "synced", tallyAmount: 12000 }),
  makeTx({ type: "income", amount: 9000, categoryId: "household", channel: "eSewa", date: `${TODAY}T13:30:00`, description: "Supply Order Payment", customerId: "c3", reconciliationStatus: "pending", tallyStatus: "pending" }),
  makeTx({ type: "income", amount: 5500, categoryId: "groceries", channel: "Cash", date: `${TODAY}T15:45:00`, description: "Cash Sales", customerId: "c5", reconciliationStatus: "matched", tallyStatus: "synced", tallyAmount: 5500 }),

  makeTx({ type: "expense", amount: 18000, categoryId: "rent", channel: "Bank", date: `${TODAY}T09:00:00`, description: "Rent Payment", provider: "nabil", reconciliationStatus: "matched", tallyStatus: "synced", tallyAmount: 18000 }),
  makeTx({ type: "expense", amount: 1200, categoryId: "other-expense", channel: "Cash", date: `${TODAY}T13:00:00`, description: "Cash Expense", reconciliationStatus: "mismatched", tallyStatus: "pending", tallyAmount: 1000 }),
  makeTx({ type: "expense", amount: 12500, categoryId: "inventory", channel: "Bank", date: `${TODAY}T10:15:00`, description: "Inventory Purchase", provider: "gibl", reconciliationStatus: "matched", tallyStatus: "synced", tallyAmount: 12500 }),
  makeTx({ type: "expense", amount: 8000, categoryId: "staff", channel: "Bank", date: `${TODAY}T16:00:00`, description: "Staff Wages", provider: "nabil", reconciliationStatus: "matched", tallyStatus: "synced", tallyAmount: 8000 }),
  makeTx({ type: "expense", amount: 2500, categoryId: "utilities", channel: "Bank", date: `${TODAY}T14:20:00`, description: "Nepal Electricity Authority", provider: "nabil", reconciliationStatus: "matched", tallyStatus: "synced", tallyAmount: 2500 }),
  makeTx({ type: "expense", amount: 1500, categoryId: "transport", channel: "Cash", date: `${TODAY}T11:40:00`, description: "Delivery Fuel", reconciliationStatus: "pending", tallyStatus: "pending" }),
  makeTx({ type: "expense", amount: 2000, categoryId: "marketing", channel: "eSewa", date: `${TODAY}T17:10:00`, description: "Local Promotion", reconciliationStatus: "matched", tallyStatus: "synced", tallyAmount: 2000 }),
  makeTx({ type: "expense", amount: 5500, categoryId: "inventory", channel: "Bank", date: `${TODAY}T18:00:00`, description: "Inventory Restock", provider: "gibl", reconciliationStatus: "matched", tallyStatus: "synced", tallyAmount: 5500 }),
];

/** Deterministic PRNG so mock history is stable across app reloads. */
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260820);
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function range(min: number, max: number) {
  return Math.round(min + rand() * (max - min));
}

const CHANNELS: TransactionChannel[] = ["Bank", "Cash", "eSewa", "Khalti"];
const INCOME_DESCRIPTIONS = ["Customer Payment", "Market Sale", "Wholesale Order Payment", "Direct Customer Sale", "Bank Deposit"];
const EXPENSE_DESCRIPTIONS: Record<string, string> = {
  inventory: "Inventory Purchase",
  rent: "Rent Payment",
  utilities: "Utility Bill",
  staff: "Staff Wages",
  transport: "Transport Expense",
  marketing: "Marketing Spend",
  "other-expense": "Cash Expense",
};

/** ~11.5 months of history (Sep 2025 - 19 Aug 2026) with a mild upward trend for believable MoM/volatility analytics. */
function generateHistory(): Transaction[] {
  const out: Transaction[] = [];
  const months: { year: number; month: number; days: number }[] = [
    { year: 2025, month: 8, days: 30 }, // Sep 2025
    { year: 2025, month: 9, days: 31 },
    { year: 2025, month: 10, days: 30 },
    { year: 2025, month: 11, days: 31 },
    { year: 2026, month: 0, days: 31 },
    { year: 2026, month: 1, days: 28 },
    { year: 2026, month: 2, days: 31 },
    { year: 2026, month: 3, days: 30 },
    { year: 2026, month: 4, days: 31 },
    { year: 2026, month: 5, days: 30 },
    { year: 2026, month: 6, days: 31 },
    { year: 2026, month: 7, days: 19 }, // Aug 2026, up to the 19th (20th handled separately)
  ];

  months.forEach((m, monthIndex) => {
    const growth = 1 + monthIndex * 0.03;
    const incomeCount = range(9, 14);
    const expenseCount = range(7, 11);

    for (let i = 0; i < incomeCount; i++) {
      const day = range(1, m.days);
      const category = pick(INCOME_CATEGORIES);
      const wholesale = rand() < 0.12;
      const amount = Math.round((wholesale ? range(20000, 42000) : range(900, 9000)) * growth);
      const channel = pick(CHANNELS);
      const hasCustomer = rand() < 0.45;
      out.push(
        makeTx({
          type: "income",
          amount,
          categoryId: category.id,
          channel,
          date: `${m.year}-${String(m.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(range(8, 19)).padStart(2, "0")}:${String(range(0, 59)).padStart(2, "0")}:00`,
          description: wholesale ? "Wholesale Order Payment" : pick(INCOME_DESCRIPTIONS),
          customerId: hasCustomer ? pick(CUSTOMERS).id : undefined,
          reconciliationStatus: rand() < 0.86 ? "matched" : rand() < 0.75 ? "pending" : "mismatched",
          tallyStatus: rand() < 0.86 ? "synced" : "pending",
          tallyAmount: rand() < 0.9 ? amount : amount - range(100, 400),
        })
      );
    }

    for (let i = 0; i < expenseCount; i++) {
      const day = range(1, m.days);
      const category = pick(EXPENSE_CATEGORIES);
      let amount: number;
      switch (category.id) {
        case "rent":
          amount = 18000;
          break;
        case "staff":
          amount = Math.round(range(6000, 9000) * growth);
          break;
        case "inventory":
          amount = Math.round(range(4000, 16000) * growth);
          break;
        case "utilities":
          amount = Math.round(range(1200, 3200) * growth);
          break;
        default:
          amount = Math.round(range(400, 3000) * growth);
      }
      const channel = category.id === "rent" || category.id === "staff" ? "Bank" : pick(CHANNELS);
      const recon: ReconciliationStatus = rand() < 0.85 ? "matched" : rand() < 0.7 ? "pending" : "mismatched";
      out.push(
        makeTx({
          type: "expense",
          amount,
          categoryId: category.id,
          channel,
          date: `${m.year}-${String(m.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(range(8, 19)).padStart(2, "0")}:${String(range(0, 59)).padStart(2, "0")}:00`,
          description: EXPENSE_DESCRIPTIONS[category.id] ?? "Business Expense",
          reconciliationStatus: recon,
          tallyStatus: recon === "matched" ? "synced" : "pending",
          tallyAmount: recon === "mismatched" ? amount - range(100, 500) : amount,
        })
      );
    }
  });

  // one flagged/unusual transaction, kept from the original prototype's fraud-review flow
  out.push(
    makeTx({
      type: "expense",
      amount: 18500,
      categoryId: "other-expense",
      channel: "eSewa",
      date: "2026-08-11T18:52:00",
      description: "Transfer to unrecognized recipient",
      status: "flagged",
      reconciliationStatus: "mismatched",
      tallyStatus: "pending",
    })
  );

  return out;
}

export const TRANSACTIONS: Transaction[] = [...generateHistory(), ...TODAY_TRANSACTIONS].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);
