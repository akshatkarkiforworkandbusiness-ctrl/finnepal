import type { AuditEvent } from "@/types";
import { AuditEventRow } from "./AuditEventRow";
import { EmptyState } from "./EmptyState";
import { ScrollText } from "lucide-react";

export function AuditTimeline({ events }: { events: AuditEvent[] }) {
  if (events.length === 0) {
    return <EmptyState icon={ScrollText} title="No audit events" description="Sensitive admin actions will appear here." />;
  }

  return (
    <div className="relative">
      <div className="absolute bottom-2 left-4 top-2 w-px bg-border" aria-hidden />
      <div className="divide-y divide-border/60">
        {events.map((event) => (
          <div key={event.id} className="relative pl-0">
            <AuditEventRow event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}
