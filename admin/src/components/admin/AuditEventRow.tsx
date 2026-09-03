import type { AuditEvent } from "@/types";
import { Badge } from "@/components/ui/badge";
import { KeyRound, Settings2, Database, ShieldCheck } from "lucide-react";

const iconMap = {
  Access: KeyRound,
  Config: Settings2,
  Data: Database,
  Security: ShieldCheck,
};

export function AuditEventRow({ event }: { event: AuditEvent }) {
  const Icon = iconMap[event.category];
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-foreground">{event.action}</p>
          <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
            {event.category}
          </Badge>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">{event.actor}</span> · {event.target}
        </p>
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">{event.time.split("·")[1]?.trim() ?? event.time}</span>
    </div>
  );
}
