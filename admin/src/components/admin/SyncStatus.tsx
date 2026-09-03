import { cn } from "@/lib/utils";

interface SyncStatusProps {
  status: "Healthy" | "Warning" | "Sandbox" | "Down";
  lastSync: string;
}

const dot: Record<string, string> = {
  Healthy: "bg-emerald-500",
  Warning: "bg-amber-500",
  Sandbox: "bg-sky-500",
  Down: "bg-[#C5161D]",
};

export function SyncStatus({ status, lastSync }: SyncStatusProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className={cn("h-2 w-2 rounded-full", dot[status])} />
      <span className="font-medium text-foreground">{status}</span>
      <span aria-hidden>·</span>
      <span>Last sync {lastSync}</span>
    </div>
  );
}
