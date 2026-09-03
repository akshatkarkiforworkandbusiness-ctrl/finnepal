import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";
import { AlertTriangle, ShieldAlert, Info } from "lucide-react";

const config: Record<RiskLevel, { cls: string; Icon: typeof Info }> = {
  High: { cls: "bg-red-50 text-[#C5161D] border-red-200", Icon: ShieldAlert },
  Medium: { cls: "bg-amber-50 text-amber-700 border-amber-200", Icon: AlertTriangle },
  Low: { cls: "bg-slate-100 text-slate-600 border-slate-200", Icon: Info },
};

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const { cls, Icon } = config[level];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium", cls, className)}>
      <Icon className="h-3 w-3" />
      {level}
    </span>
  );
}
