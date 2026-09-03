import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export function EnvironmentBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-[#C5161D]/30 bg-[#C5161D]/10 px-2.5 py-1 text-xs font-semibold tracking-wide text-[#C5161D]",
        className
      )}
    >
      <FlaskConical className="h-3.5 w-3.5" />
      SANDBOX
    </span>
  );
}
