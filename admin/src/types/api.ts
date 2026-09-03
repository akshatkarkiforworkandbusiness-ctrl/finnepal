// Types mirroring backend/app/schemas/*.py responses — real API data, as
// opposed to the mock/prototype types in "./index.ts".

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface AdminMe {
  id: string;
  name: string;
  email: string;
  photo_url: string | null;
  role: "SUPER_ADMIN" | "OPERATIONS_ADMIN" | "SUPPORT_ADMIN" | "COMPLIANCE_ADMIN";
  is_active: boolean;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface OverviewStats {
  total_users: number;
  total_businesses: number;
  total_providers_connected: number;
  total_transactions: number;
  total_income: number;
  total_expense: number;
  net_cash_flow: number;
  open_risk_alerts: number;
  open_support_tickets: number;
}

export interface ProviderAdmin {
  id: string;
  code: string;
  name: string;
  short_name: string | null;
  category: string;
  availability: string;
  color: string | null;
  description: string | null;
  health_status: "HEALTHY" | "WARNING" | "SANDBOX" | "DOWN" | null;
  uptime: number | null;
  success_rate: number | null;
}

export interface RiskAlertAdmin {
  id: string;
  business_id: string | null;
  business_name: string | null;
  level: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string | null;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
  detected_at: string;
  created_at: string;
}

export interface UserAdmin {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  location: string | null;
  created_at: string;
  business_count: number;
  transaction_count: number;
}

export interface TransactionAdmin {
  id: string;
  business_id: string;
  provider_id: string | null;
  external_reference: string | null;
  type: "INCOME" | "EXPENSE";
  source: string;
  category: string | null;
  amount: number;
  currency: string;
  status: "COMPLETED" | "PENDING" | "FAILED" | "FLAGGED";
  description: string | null;
  occurred_at: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  business_name: string;
  provider_name: string | null;
  provider_code: string | null;
}

export interface BusinessAdmin {
  id: string;
  owner_user_id: string;
  name: string;
  type: string;
  location: string | null;
  activity: "HIGH" | "MEDIUM" | "LOW";
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  created_at: string;
  updated_at: string;
  owner_name: string;
  total_income: number;
  total_expense: number;
  net_cash_flow: number;
}

export interface AuditLogAdmin {
  id: string;
  admin_user_id: string | null;
  admin_name: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  description: string | null;
  created_at: string;
}

export interface AiUsageStats {
  total_calls: number;
  total_tokens: number;
  rate_limit_per_minute: number;
}

export interface AiUsageAdmin {
  id: string;
  user_id: string;
  user_name: string | null;
  business_id: string | null;
  model: string;
  prompt: string;
  response: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  created_at: string;
}

export interface AiUsageOverview {
  stats: AiUsageStats;
  page: Page<AiUsageAdmin>;
}
