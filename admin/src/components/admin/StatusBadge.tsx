import {
  Ban,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Info,
  Circle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "neutral" | "info";

const toneMap: Record<string, Tone> = {
  active: "success",
  completed: "success",
  success: "success",
  healthy: "success",
  connected: "success",
  granted: "success",
  resolved: "success",
  verified: "success",
  matched: "success",
  synced: "success",
  "profile ready": "success",
  "on track": "success",
  operational: "success",
  available: "success",
  pending: "warning",
  investigating: "warning",
  warning: "warning",
  degraded: "warning",
  "review required": "warning",
  "consent required": "warning",
  mismatch: "warning",
  behind: "warning",
  unread: "warning",
  sandbox: "info",
  read: "info",
  "coming soon": "info",
  suspended: "danger",
  failed: "danger",
  down: "danger",
  revoked: "danger",
  rejected: "danger",
  flagged: "danger",
  critical: "danger",
  high: "danger",
  medium: "warning",
  low: "neutral",
  mismatched: "danger",
  duplicate: "danger",
  "incomplete data": "danger",
  open: "info",
  expired: "neutral",
  reversed: "neutral",
};

// Specific icon per status where the word carries a distinct meaning beyond
// its tone (e.g. "suspended" and "failed" are both danger-toned, but a
// blocked account isn't the same shape as a failed transaction).
const statusIconMap: Record<string, LucideIcon> = {
  suspended: Ban,
  revoked: Ban,
  rejected: Ban,
  failed: XCircle,
  down: XCircle,
  flagged: AlertTriangle,
  critical: AlertTriangle,
  high: AlertTriangle,
  mismatch: AlertTriangle,
  mismatched: AlertTriangle,
  pending: Clock,
  investigating: Clock,
  "review required": Clock,
  "consent required": Clock,
  behind: Clock,
};

const toneIcon: Record<Tone, LucideIcon> = {
  success: CheckCircle2,
  warning: Clock,
  danger: XCircle,
  neutral: Circle,
  info: Info,
};

const toneClasses: Record<Tone, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-[#C5161D] border-red-200",
  neutral: "bg-slate-100 text-slate-600 border-slate-200",
  info: "bg-sky-50 text-sky-700 border-sky-200",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
  /** @deprecated icons replaced the dot; kept so old callers don't break. */
  withDot?: boolean;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const tone = toneMap[key] ?? "neutral";
  const Icon = statusIconMap[key] ?? toneIcon[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}
