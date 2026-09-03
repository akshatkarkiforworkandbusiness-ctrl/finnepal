// Domain types for the Orbit Admin Dashboard (mock/prototype data only).

export type UserStatus = "Active" | "Suspended" | "Pending";
export type BusinessStatus = "Active" | "Pending" | "Suspended";
export type TxStatus = "Completed" | "Pending" | "Failed" | "Reversed" | "Flagged";
export type TxType = "Income" | "Expense";
export type TxChannel = "Bank" | "eSewa" | "Khalti" | "Cash" | "Other";
export type ReconciliationStatus = "Matched" | "Pending" | "Mismatch" | "Duplicate" | "Failed" | "Unreconciled";
export type ProviderStatus = "Healthy" | "Warning" | "Sandbox" | "Down";
export type RiskLevel = "High" | "Medium" | "Low";
export type ConsentStatus = "Granted" | "Pending" | "Revoked" | "Expired";
export type Activity = "High" | "Medium" | "Low";
export type KycStatus = "Verified" | "Pending" | "Rejected" | "Review Required";
export type CreditProfileStatus = "Profile Ready" | "Incomplete Data" | "Consent Required" | "Review Required";
export type TallySyncStatus = "Synced" | "Pending" | "Failed";
export type TallyLogStatus = "SUCCESS" | "LINEERROR" | "ERROR" | "CREATED";
export type NotificationSeverity = "Critical" | "High" | "Medium" | "Low";
export type AdminRoleName =
  | "Super Admin"
  | "Operations Admin"
  | "Compliance Admin"
  | "Support Admin"
  | "Analytics Admin"
  | "Integration Admin";
export type BusinessCategory =
  | "Retail"
  | "Restaurant"
  | "Services"
  | "Wholesale"
  | "Agriculture"
  | "Freelancer"
  | "Other";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessId: string;
  business: string;
  status: UserStatus;
  kyc: KycStatus;
  providers: number;
  transactions: number;
  lastActive: string;
  joined: string;
  location: string;
}

export interface Business {
  id: string;
  name: string;
  ownerId: string;
  owner: string;
  type: string;
  category: BusinessCategory;
  location: string;
  activity: Activity;
  providers: number;
  status: BusinessStatus;
  kyc: KycStatus;
  created: string;
  monthlyVolume: number;
  monthlySales: number;
  monthlyExpenses: number;
  tallyConnected: boolean;
  consentStatus: ConsentStatus;
}

export interface Transaction {
  id: string;
  date: string;
  businessId: string;
  business: string;
  provider: string;
  channel: TxChannel;
  type: TxType;
  category: string;
  amount: number;
  status: TxStatus;
  source: string;
  reference: string;
  reconciliation: ReconciliationStatus;
}

export interface Provider {
  id: string;
  name: string;
  category: string;
  status: ProviderStatus;
  environment: "Sandbox" | "Production";
  lastSync: string;
  connections: number;
  transactions: number;
  value: number;
  uptime: number;
  successRate: number;
  apiStatus: "Operational" | "Degraded" | "Down";
  webhookStatus: "Operational" | "Degraded" | "Down";
}

export interface RiskAlert {
  id: string;
  level: RiskLevel;
  title: string;
  description: string;
  business: string;
  time: string;
  status: "Open" | "Investigating" | "Resolved";
}

export interface Consent {
  id: string;
  user: string;
  business: string;
  provider: string;
  scope: string;
  purpose: string;
  status: ConsentStatus;
  granted: string;
  expires: string;
}

export interface AuditEvent {
  id: string;
  time: string;
  actor: string;
  action: string;
  target: string;
  targetType: string;
  ip: string;
  result: "Success" | "Failed";
  category: "Access" | "Config" | "Data" | "Security";
}

export interface ActivityItem {
  id: string;
  time: string;
  user: string;
  business: string;
  event: string;
  provider: string;
  status: "Success" | "Warning" | "Failed";
}

export interface OrbitNotification {
  id: string;
  type: "sync" | "kyc" | "risk" | "transaction" | "security" | "system";
  severity: NotificationSeverity;
  title: string;
  description: string;
  time: string;
  status: "Unread" | "Read" | "Resolved";
}

export type SupportTicketPriority = "Urgent" | "High" | "Normal" | "Low";
export type SupportTicketStatus = "Open" | "Pending" | "Resolved";

export interface SupportTicket {
  id: string;
  subject: string;
  user: string;
  business: string;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  assignee: string;
  updated: string;
}

export interface ReconciliationRecord {
  id: string;
  transactionId: string;
  business: string;
  source: string;
  amount: number;
  date: string;
  status: ReconciliationStatus;
  matchedWith: string;
}

export interface CreditProfile {
  id: string;
  businessId: string;
  business: string;
  status: CreditProfileStatus;
  dataCoverage: number;
  consentStatus: ConsentStatus;
  monthsOfHistory: number;
  lenderRequests: number;
  prototypeScore: number | null;
  lastUpdated: string;
}

export interface TallyConnection {
  id: string;
  business: string;
  status: TallySyncStatus;
  lastSync: string;
  vouchersSynced: number;
  ledgersSynced: number;
  errors: number;
}

export interface TallySyncLog {
  id: string;
  business: string;
  type: "Ledger" | "Bank" | "Sales" | "Payment";
  records: number;
  started: string;
  completed: string;
  status: TallyLogStatus;
  summary: string;
  lineErrors: string[];
}

export interface KycRecord {
  id: string;
  user: string;
  business: string;
  status: KycStatus;
  submitted: string;
  reviewed: string | null;
  reviewer: string | null;
}

export interface SecurityEvent {
  id: string;
  time: string;
  type: "Failed Login" | "Suspicious Activity" | "API Failure" | "Webhook Failure" | "Integration Error" | "Session";
  actor: string;
  ip: string;
  description: string;
  severity: NotificationSeverity;
}

export interface AdminSession {
  id: string;
  admin: string;
  role: AdminRoleName;
  ip: string;
  device: string;
  started: string;
  lastActive: string;
}

export interface AdminRole {
  name: AdminRoleName;
  description: string;
  permissions: string[];
}

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: AdminRoleName;
  status: "Active" | "Suspended";
  lastActive: string;
}

export interface InsuranceProduct {
  id: string;
  name: string;
  provider: string;
  category: string;
  businessesDiscovered: number;
  businessesEnrolled: number;
  status: "Available" | "Coming Soon";
}

export interface SavingsSummary {
  businessId: string;
  business: string;
  goalName: string;
  targetAmount: number;
  savedAmount: number;
  status: "On Track" | "Behind" | "Completed";
}

export interface CashFlowPoint {
  label: string;
  income: number;
  expense: number;
  net: number;
}

export interface BankConnection {
  id: string;
  name: string;
  connectedBusinesses: number;
  lastSync: string;
  status: ProviderStatus;
  successRate: number;
}

export interface WalletConnection {
  id: string;
  name: string;
  connectedBusinesses: number;
  lastSync: string;
  status: ProviderStatus;
  successRate: number;
}

export interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  service: string;
  description: string;
}

export interface ApiLogEntry {
  id: string;
  time: string;
  method: string;
  path: string;
  status: number;
  latencyMs: number;
}
