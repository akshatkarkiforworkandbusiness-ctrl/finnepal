import type { BankConnection, Provider, WalletConnection } from "@/types";

export const paymentProviders: Provider[] = [
  { id: "esewa", name: "eSewa", category: "Digital Wallet", status: "Healthy", environment: "Sandbox", lastSync: "2 min ago", connections: 2842, transactions: 8240, value: 5800000, uptime: 99.98, successRate: 98.4, apiStatus: "Operational", webhookStatus: "Operational" },
  { id: "khalti", name: "Khalti", category: "Digital Wallet", status: "Healthy", environment: "Sandbox", lastSync: "4 min ago", connections: 2140, transactions: 6920, value: 4200000, uptime: 99.95, successRate: 97.9, apiStatus: "Operational", webhookStatus: "Operational" },
  { id: "bank", name: "Bank", category: "Banking", status: "Healthy", environment: "Sandbox", lastSync: "6 min ago", connections: 1830, transactions: 3266, value: 2800000, uptime: 99.2, successRate: 99.1, apiStatus: "Operational", webhookStatus: "Degraded" },
  { id: "other-wallets", name: "Other Wallets", category: "Digital Wallet", status: "Warning", environment: "Sandbox", lastSync: "32 min ago", connections: 426, transactions: 1210, value: 600000, uptime: 97.4, successRate: 96.2, apiStatus: "Degraded", webhookStatus: "Operational" },
];

export const getProviderById = (id: string) => paymentProviders.find((p) => p.id === id) ?? paymentProviders[0];

export const banks: BankConnection[] = [
  { id: "nic-asia", name: "NIC Asia Bank", connectedBusinesses: 620, lastSync: "5 min ago", status: "Healthy", successRate: 99.3 },
  { id: "nabil", name: "Nabil Bank", connectedBusinesses: 512, lastSync: "9 min ago", status: "Healthy", successRate: 99.0 },
  { id: "nmb", name: "NMB Bank", connectedBusinesses: 384, lastSync: "18 min ago", status: "Healthy", successRate: 98.6 },
  { id: "global-ime", name: "Global IME Bank", connectedBusinesses: 314, lastSync: "1 hr ago", status: "Warning", successRate: 96.1 },
];

export const wallets: WalletConnection[] = [
  { id: "esewa-w", name: "eSewa Wallet", connectedBusinesses: 2842, lastSync: "2 min ago", status: "Healthy", successRate: 98.4 },
  { id: "khalti-w", name: "Khalti Wallet", connectedBusinesses: 2140, lastSync: "4 min ago", status: "Healthy", successRate: 97.9 },
  { id: "imepay", name: "IME Pay", connectedBusinesses: 268, lastSync: "40 min ago", status: "Warning", successRate: 95.4 },
  { id: "prabhupay", name: "PrabhuPay", connectedBusinesses: 158, lastSync: "2 hr ago", status: "Sandbox", successRate: 94.8 },
];

export const integrationHealth: { name: string; connected: number; total: number; label?: string }[] = [
  { name: "Banks", connected: 5, total: 8 },
  { name: "Wallets", connected: 3, total: 4 },
  { name: "Tally", connected: 142, total: 142, label: "142 Connected" },
  { name: "Payment APIs", connected: 1, total: 1, label: "All Systems Operational" },
];
