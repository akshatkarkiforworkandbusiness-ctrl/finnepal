import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function MaskedValue({ label, className }: { label?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground", className)}>
      <Lock className="h-3 w-3" />
      {label ?? "••••••••••••••••"}
    </span>
  );
}
