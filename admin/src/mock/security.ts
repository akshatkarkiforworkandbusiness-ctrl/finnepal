import type { AdminSession, SecurityEvent } from "@/types";

export const activeSessions: AdminSession[] = [
  { id: "SES-1", admin: "Orbit Admin", role: "Super Admin", ip: "103.10.24.18", device: "Chrome · macOS", started: "Aug 18, 2026 · 07:02", lastActive: "2 min ago" },
  { id: "SES-2", admin: "Priya (Compliance)", role: "Compliance Admin", ip: "103.10.24.9", device: "Chrome · Windows", started: "Aug 18, 2026 · 08:10", lastActive: "6 min ago" },
  { id: "SES-3", admin: "Rohan (Ops)", role: "Operations Admin", ip: "103.10.24.31", device: "Safari · macOS", started: "Aug 18, 2026 · 08:44", lastActive: "18 min ago" },
];

export const securityEvents: SecurityEvent[] = [
  { id: "SEC-1", time: "10m ago", type: "Failed Login", actor: "unknown@example.com", ip: "45.132.10.4", description: "5 consecutive failed login attempts.", severity: "Critical" },
  { id: "SEC-2", time: "34m ago", type: "Suspicious Activity", actor: "USR-1005", ip: "182.93.4.11", description: "Login from a new device following a location change.", severity: "High" },
  { id: "SEC-3", time: "1h ago", type: "API Failure", actor: "System", ip: "internal", description: "Payment Providers API returned 502 for 3 consecutive requests.", severity: "High" },
  { id: "SEC-4", time: "2h ago", type: "Webhook Failure", actor: "System", ip: "internal", description: "Bank webhook delivery failed after 3 retries.", severity: "Medium" },
  { id: "SEC-5", time: "3h ago", type: "Integration Error", actor: "System", ip: "internal", description: "Tally sync connection timed out for 2 businesses.", severity: "Medium" },
  { id: "SEC-6", time: "5h ago", type: "Session", actor: "Rohan (Ops)", ip: "103.10.24.31", description: "New admin session started.", severity: "Low" },
];

export const securityStats = {
  activeSessions: activeSessions.length,
  failedLogins24h: 23,
  suspiciousActivity: 7,
  apiFailures: 4,
  webhookFailures: 2,
  integrationErrors: 3,
};
