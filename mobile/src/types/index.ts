export type ProviderId =
  | "esewa"
  | "khalti"
  | "nabil"
  | "gibl"
  | "nicasia"
  | "nmb"
  | "himalayan"
  | "nepalbank"
  | "connectips"
  | "fonepay"
  | "siddhartha"
  | "rastriyabanijya"
  | "stripe"
  | "kumari"
  | "standardchartered"
  | "tally"
  | "cash";

export type ProviderCategory = "bank" | "wallet" | "payment" | "business" | "accounting" | "cash";

export type ProviderAvailability = "available" | "demo" | "coming_soon" | "partner" | "sandbox";

export interface Provider {
  id: ProviderId;
  name: string;
  shortName: string;
  category: ProviderCategory;
  color: string;
  availability: ProviderAvailability;
  description: string;
}

export type ConnectionStatus = "connected" | "restricted" | "disconnected";

export interface Connection {
  provider: ProviderId;
  status: ConnectionStatus;
  permissions: string[];
  lastSynced: string;
  connectedAt: string;
}

export type TransactionType = "income" | "expense";
export type TransactionStatus = "completed" | "pending" | "flagged";
export type TransactionChannel = "Bank" | "eSewa" | "Khalti" | "Cash" | "Tally" | "Other";
export type ReconciliationStatus = "matched" | "pending" | "mismatched";
export type TallyStatus = "synced" | "pending" | "not_synced";

export interface Transaction {
  id: string;
  businessId: string;
  type: TransactionType;
  amount: number;
  currency: "NPR";
  categoryId: string;
  categoryName: string;
  channel: TransactionChannel;
  provider: ProviderId;
  customerId?: string;
  customerName?: string;
  date: string;
  note?: string;
  description: string;
  status: TransactionStatus;
  reference: string;
  reconciliationStatus: ReconciliationStatus;
  tallyStatus: TallyStatus;
  tallyAmount?: number;
  verified: boolean;
}

export type BusinessType = "Grocery / Kirana" | "Restaurant / Cafe" | "Clothing" | "Pharmacy" | "Electronics" | "Other";

export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  location: string;
  panVat: string;
  fiscalYear: string;
}

export interface Customer {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
}

export interface ReconciliationRecordType {
  id: string;
  transactionId: string;
  label: string;
  orbitAmount: number;
  tallyAmount?: number;
  status: ReconciliationStatus;
  date: string;
}

export interface TallySyncStep {
  id: string;
  label: string;
  done: boolean;
}

export interface TallySyncState {
  connected: boolean;
  lastSync: string;
  orbitToTally: { transactions: number; ledgers: number; vouchers: number };
  tallyToOrbit: { records: number; needsReview: number };
  steps: TallySyncStep[];
}

export interface ConsentDataItem {
  id: string;
  label: string;
  selected: boolean;
}

export interface ConsentRequest {
  id: string;
  requesterName: string;
  purpose: string;
  dataItems: ConsentDataItem[];
  durationDays: number;
}

export interface ActivityLogEntry {
  id: string;
  label: string;
  time: string;
}

export interface FinancingOption {
  id: string;
  title: string;
  maxAmount: number;
  note: string;
}

export interface UserProfile {
  fullName: string;
  phone: string;
  email?: string;
  location: string;
  memberSince: string;
  photoUri?: string;
}
