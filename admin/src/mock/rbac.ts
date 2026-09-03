import type { AdminRole, AdminUserRecord } from "@/types";

export const adminRoles: AdminRole[] = [
  { name: "Super Admin", description: "Full access to every module.", permissions: ["Everything"] },
  { name: "Operations Admin", description: "Manages day-to-day platform operations.", permissions: ["Users", "Businesses", "Transactions"] },
  { name: "Compliance Admin", description: "Handles KYC, consent, and audit oversight.", permissions: ["KYC", "Consent", "Audit"] },
  { name: "Integration Admin", description: "Manages payment, banking, and Tally integrations.", permissions: ["Payments", "Banks", "Tally", "API"] },
  { name: "Analytics Admin", description: "Views platform analytics and reports.", permissions: ["Analytics", "Reports"] },
  { name: "Support Admin", description: "Read-only visibility to help resolve user issues.", permissions: ["Users", "Businesses", "Read-only Transactions"] },
];

export const adminUsers: AdminUserRecord[] = [
  { id: "ADM-1", name: "Orbit Admin", email: "admin@orbit.demo", role: "Super Admin", status: "Active", lastActive: "2 min ago" },
  { id: "ADM-2", name: "Rohan Shakya", email: "rohan.ops@orbit.demo", role: "Operations Admin", status: "Active", lastActive: "18 min ago" },
  { id: "ADM-3", name: "Priya Maharjan", email: "priya.compliance@orbit.demo", role: "Compliance Admin", status: "Active", lastActive: "6 min ago" },
  { id: "ADM-4", name: "Suman Bhattarai", email: "suman.integrations@orbit.demo", role: "Integration Admin", status: "Active", lastActive: "1 hr ago" },
  { id: "ADM-5", name: "Kabita Poudel", email: "kabita.analytics@orbit.demo", role: "Analytics Admin", status: "Active", lastActive: "3 hr ago" },
  { id: "ADM-6", name: "Bikash Tamang", email: "bikash.support@orbit.demo", role: "Support Admin", status: "Suspended", lastActive: "2 days ago" },
];
