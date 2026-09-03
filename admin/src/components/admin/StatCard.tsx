import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  comparison?: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, change, comparison, icon: Icon }: StatCardProps) {
  const positive = (change ?? 0) >= 0;
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-primary">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground tabular-nums">{value}</p>
      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium",
              positive ? "text-emerald-600" : "text-[#C5161D]"
            )}
          >
            {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {positive ? "+" : ""}
            {change}%
          </span>
          <span className="text-muted-foreground">{comparison}</span>
        </div>
      )}
    </Card>
  );
}
