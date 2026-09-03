import { ProviderId, Transaction } from "@/types";
import { TRANSACTIONS } from "./mockTransactions";

export interface PaymentProviderAdapter {
  id: ProviderId;
  authorize(): Promise<{ success: true }>;
  fetchTransactions(): Promise<Transaction[]>;
}

function makeMockAdapter(id: ProviderId): PaymentProviderAdapter {
  return {
    id,
    authorize: () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1800)),
    fetchTransactions: () =>
      new Promise((resolve) =>
        setTimeout(() => resolve(TRANSACTIONS.filter((t) => t.provider === id)), 600)
      ),
  };
}

export const EsewaAdapter = makeMockAdapter("esewa");
export const KhaltiAdapter = makeMockAdapter("khalti");
export const BankAdapter = makeMockAdapter("nabil");
export const ConnectIPSAdapter = makeMockAdapter("connectips");
export const FonepayAdapter = makeMockAdapter("fonepay");
export const StripeAdapter = makeMockAdapter("stripe");

export const ADAPTERS: Record<string, PaymentProviderAdapter> = {
  esewa: EsewaAdapter,
  khalti: KhaltiAdapter,
  nabil: BankAdapter,
  gibl: makeMockAdapter("gibl"),
  nicasia: makeMockAdapter("nicasia"),
  nmb: makeMockAdapter("nmb"),
  himalayan: makeMockAdapter("himalayan"),
  nepalbank: makeMockAdapter("nepalbank"),
  siddhartha: makeMockAdapter("siddhartha"),
  rastriyabanijya: makeMockAdapter("rastriyabanijya"),
  connectips: ConnectIPSAdapter,
  fonepay: FonepayAdapter,
  stripe: StripeAdapter,
  kumari: makeMockAdapter("kumari"),
  standardchartered: makeMockAdapter("standardchartered"),
  tally: makeMockAdapter("tally"),
};
