import type { ActivityItem } from "@/types";
import { StatusBadge } from "./StatusBadge";

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <ol className="relative space-y-4 pl-5">
      <span className="absolute left-[5px] top-1 h-[calc(100%-0.5rem)] w-px bg-border" aria-hidden />
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span className="absolute -left-[13px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" aria-hidden />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-medium">{item.user}</span> · {item.event}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {item.business} · {item.provider}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <StatusBadge status={item.status} withDot={false} />
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
