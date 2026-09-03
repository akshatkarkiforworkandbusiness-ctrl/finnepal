import type {
  ActivityItem,
  AuditEvent,
  Business,
  Consent,
  OrbitNotification,
  Provider,
  RiskAlert,
  SupportTicket,
  Transaction,
  User,
} from "@/types";

export interface OverviewStat {
  key: string;
  label: string;
  value: string;
  change: number;
  comparison: string;
}

export const overviewStats: OverviewStat[] = [
  { key: "users", label: "Total Users", value: "24,680", change: 12.4, comparison: "from last month" },
  { key: "businesses", label: "Active Businesses", value: "8,420", change: 8.1, comparison: "from last month" },
  { key: "providers", label: "Connected Providers", value: "13,890", change: 5.7, comparison: "from last month" },
  { key: "synced", label: "Transactions Synced", value: "1.84M", change: 18.2, comparison: "from last month" },
];

export interface ChartPoint {
  label: string;
  transactions: number;
  volume: number;
  businesses: number;
}

export const transactionChartData: ChartPoint[] = [
  { label: "Mon", transactions: 4200, volume: 320, businesses: 6100 },
  { label: "Tue", transactions: 5100, volume: 410, businesses: 6400 },
  { label: "Wed", transactions: 4800, volume: 380, businesses: 6600 },
  { label: "Thu", transactions: 6200, volume: 470, businesses: 7100 },
  { label: "Fri", transactions: 7300, volume: 560, businesses: 7600 },
  { label: "Sat", transactions: 6800, volume: 520, businesses: 8000 },
  { label: "Sun", transactions: 6420, volume: 480, businesses: 8420 },
];

export const providerHealth: Provider[] = [
  { id: "esewa", name: "eSewa Business", category: "Digital Wallet", status: "Healthy", lastSync: "2 min ago", connections: 5820, uptime: 99.98, successRate: 99.6 },
  { id: "khalti", name: "Khalti Business", category: "Digital Wallet", status: "Healthy", lastSync: "4 min ago", connections: 4310, uptime: 99.95, successRate: 99.4 },
  { id: "bank-demo", name: "Bank Demo", category: "Banking", status: "Sandbox", lastSync: "10 min ago", connections: 2180, uptime: 99.2, successRate: 98.1 },
  { id: "fonepay", name: "Fonepay Demo", category: "Payment Network", status: "Warning", lastSync: "32 min ago", connections: 1580, uptime: 97.4, successRate: 95.3 },
];

export const riskAlerts: RiskAlert[] = [
  { id: "RA-4821", level: "High", title: "Unusual transaction pattern", description: "Sudden 6x spike in transaction volume outside normal hours.", business: "Ram Electronics", time: "12 min ago", status: "Open" },
  { id: "RA-4820", level: "Medium", title: "Repeated failed connection", description: "5 consecutive provider connection failures on Bank Demo.", business: "Sita Boutique", time: "48 min ago", status: "Investigating" },
  { id: "RA-4819", level: "Low", title: "Incomplete business profile", description: "Business verification documents pending for over 14 days.", business: "Gita Grocery", time: "3 hrs ago", status: "Open" },
  { id: "RA-4818", level: "Medium", title: "Consent nearing expiry", description: "Data-sharing consent expires in 3 days for a connected provider.", business: "Hari Hardware", time: "5 hrs ago", status: "Open" },
  { id: "RA-4817", level: "Low", title: "Stale sync window", description: "No successful sync recorded in the last 24 hours.", business: "Bina Tailors", time: "8 hrs ago", status: "Resolved" },
];

export const recentActivity: ActivityItem[] = [
  { id: "a1", time: "08:32", user: "Amit", business: "Amit Mobile Store", event: "Transaction synced", provider: "Khalti", status: "Success" },
  { id: "a2", time: "08:29", user: "Sita", business: "Sita Boutique", event: "Provider connected", provider: "eSewa", status: "Success" },
  { id: "a3", time: "08:24", user: "Ram", business: "Ram Electronics", event: "Sync failed", provider: "Bank Demo", status: "Warning" },
  { id: "a4", time: "08:19", user: "Gita", business: "Gita Grocery", event: "Consent granted", provider: "Fonepay", status: "Success" },
  { id: "a5", time: "08:11", user: "Hari", business: "Hari Hardware", event: "Transaction synced", provider: "eSewa", status: "Success" },
  { id: "a6", time: "08:04", user: "Bina", business: "Bina Tailors", event: "Provider disconnected", provider: "Khalti", status: "Failed" },
];

const owners = ["Amit Pokhrel", "Sita Shrestha", "Ram Karki", "Gita Thapa", "Hari Adhikari", "Bina Rai", "Nabin Gurung", "Puja Magar", "Deepak Lama", "Anita Basnet"];
const bizNames = ["Amit Mobile Store", "Sita Boutique", "Ram Electronics", "Gita Grocery", "Hari Hardware", "Bina Tailors", "Nabin Cafe", "Puja Salon", "Deepak Motors", "Anita Pharmacy"];
const types = ["Retail", "Fashion", "Electronics", "Grocery", "Hardware", "Services", "Food & Beverage", "Beauty", "Automotive", "Healthcare"];
const locations = ["Itahari", "Kathmandu", "Pokhara", "Biratnagar", "Lalitpur", "Dharan", "Butwal", "Bhaktapur", "Chitwan", "Birgunj"];
const statuses: User["status"][] = ["Active", "Active", "Active", "Pending", "Suspended", "Active", "Active", "Pending", "Active", "Active"];
const activityLevels: Business["activity"][] = ["High", "Medium", "Low"];

export const users: User[] = owners.map((name, i) => ({
  id: `USR-${1001 + i}`,
  name,
  email: `${name.split(" ")[0].toLowerCase()}@orbit.demo`,
  phone: `+977 98${(10000000 + i * 137).toString().slice(0, 8)}`,
  businessId: `BIZ-${2001 + i}`,
  business: bizNames[i],
  status: statuses[i],
  providers: (i % 3) + 1,
  transactions: 1248 - i * 87,
  lastActive: i === 0 ? "2 min ago" : `${i * 7 + 3} min ago`,
  joined: `Aug ${12 - (i % 10)}, 2026`,
  location: locations[i],
}));

export const businesses: Business[] = bizNames.map((name, i) => ({
  id: `BIZ-${2001 + i}`,
  name,
  ownerId: `USR-${1001 + i}`,
  owner: owners[i],
  type: types[i],
  location: locations[i],
  activity: activityLevels[i % 3],
  providers: (i % 3) + 1,
  status: (["Active", "Active", "Active", "Pending", "Suspended"] as Business["status"][])[i % 5],
  created: `Aug ${12 - (i % 10)}, 2026`,
  monthlySales: 184500 - i * 9200,
  monthlyExpenses: 112300 - i * 5100,
}));

const provNames = ["Khalti", "eSewa", "Fonepay", "Bank Demo"];
const txTypes = ["Sale", "Refund", "Payout", "Expense"];
const txStatus: Transaction["status"][] = ["Completed", "Completed", "Completed", "Pending", "Failed", "Completed"];

export const transactions: Transaction[] = Array.from({ length: 28 }).map((_, i) => {
  const b = businesses[i % businesses.length];
  return {
    id: `TX-${829102 - i}`,
    date: `Aug ${18 - (i % 14)}, 2026`,
    businessId: b.id,
    business: b.name,
    provider: provNames[i % provNames.length],
    type: txTypes[i % txTypes.length],
    amount: 2500 + (i % 9) * 1450,
    status: txStatus[i % txStatus.length],
    source: i % 4 === 3 ? "Bank Feed" : "Provider API",
    reference: `DEMO-${provNames[i % provNames.length].slice(0, 2).toUpperCase()}-${829102 - i}`,
  };
});

export const providers: Provider[] = providerHealth;

export const consents: Consent[] = businesses.slice(0, 8).map((b, i) => ({
  id: `CNS-${5001 + i}`,
  user: b.owner,
  business: b.name,
  provider: provNames[i % provNames.length],
  scope: (["Transactions, Balance", "Transactions", "Balance, Profile", "Transactions, Profile"] as string[])[i % 4],
  status: (["Granted", "Granted", "Pending", "Revoked", "Expired"] as Consent["status"][])[i % 5],
  granted: `Aug ${10 - (i % 8)}, 2026`,
  expires: `Feb ${10 - (i % 8)}, 2027`,
}));

export const auditEvents: AuditEvent[] = [
  { id: "AUD-9001", time: "Aug 18, 2026 · 08:32", actor: "Orbit Admin", action: "Viewed transaction record", target: "TX-829102", category: "Access" },
  { id: "AUD-9000", time: "Aug 18, 2026 · 08:20", actor: "Priya (Compliance)", action: "Updated risk alert status", target: "RA-4820", category: "Security" },
  { id: "AUD-8999", time: "Aug 18, 2026 · 07:58", actor: "System", action: "Provider sync completed", target: "Khalti Business", category: "Data" },
  { id: "AUD-8998", time: "Aug 18, 2026 · 07:41", actor: "Orbit Admin", action: "Suspended user account", target: "USR-1005", category: "Security" },
  { id: "AUD-8997", time: "Aug 18, 2026 · 07:22", actor: "Rohan (Ops)", action: "Changed system setting", target: "Sync interval → 5 min", category: "Config" },
  { id: "AUD-8996", time: "Aug 18, 2026 · 06:50", actor: "System", action: "Consent auto-expired", target: "CNS-5007", category: "Data" },
  { id: "AUD-8995", time: "Aug 18, 2026 · 06:33", actor: "Orbit Admin", action: "Exported business report", target: "BIZ-2003", category: "Access" },
];

export const supportTickets: SupportTicket[] = [
  { id: "TCK-3201", subject: "Provider sync stuck on Bank Demo", user: "Ram Karki", business: "Ram Electronics", priority: "Urgent", status: "Open", assignee: "Rohan", updated: "8 min ago" },
  { id: "TCK-3200", subject: "Cannot reconnect eSewa account", user: "Sita Shrestha", business: "Sita Boutique", priority: "High", status: "Pending", assignee: "Priya", updated: "34 min ago" },
  { id: "TCK-3199", subject: "Transactions missing from last week", user: "Hari Adhikari", business: "Hari Hardware", priority: "Normal", status: "Open", assignee: "Unassigned", updated: "1 hr ago" },
  { id: "TCK-3198", subject: "How do I export monthly report?", user: "Gita Thapa", business: "Gita Grocery", priority: "Low", status: "Resolved", assignee: "Rohan", updated: "3 hrs ago" },
  { id: "TCK-3197", subject: "Duplicate transaction showing twice", user: "Amit Pokhrel", business: "Amit Mobile Store", priority: "High", status: "Pending", assignee: "Priya", updated: "5 hrs ago" },
];

export const notifications: OrbitNotification[] = [
  { id: "n1", type: "sync", title: "Provider sync warning", description: "Fonepay Demo last synced 32 min ago.", time: "12 min ago" },
  { id: "n2", type: "ticket", title: "New support ticket", description: "TCK-3201 — Provider sync stuck on Bank Demo.", time: "8 min ago" },
  { id: "n3", type: "risk", title: "Risk alert", description: "High: Unusual transaction pattern on Ram Electronics.", time: "12 min ago" },
  { id: "n4", type: "transaction", title: "Failed transaction sync", description: "3 transactions failed to normalize from Bank Demo.", time: "20 min ago" },
];

export const getUserById = (id: string) => users.find((u) => u.id === id) ?? users[0];
export const getBusinessById = (id: string) => businesses.find((b) => b.id === id) ?? businesses[0];
export const getTransactionById = (id: string) => transactions.find((t) => t.id === id) ?? transactions[0];
export const getProviderById = (id: string) => providers.find((p) => p.id === id) ?? providers[0];
