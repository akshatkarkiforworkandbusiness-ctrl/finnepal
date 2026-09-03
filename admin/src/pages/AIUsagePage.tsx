import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Coins, Gauge } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { AiUsageAdmin, AiUsageOverview } from "@/types/api";

function formatCompact(n: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export default function AIUsagePage() {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "ai-usage", page],
    queryFn: () => api.get<AiUsageOverview>("/admin/ai-usage", { page, page_size: pageSize }),
  });

  const columns: Column<AiUsageAdmin>[] = [
    { key: "user", header: "User", cell: (r) => <span className="text-sm font-medium">{r.user_name ?? r.user_id}</span> },
    { key: "model", header: "Model", cell: (r) => <span className="font-mono text-xs text-muted-foreground">{r.model}</span> },
    {
      key: "prompt",
      header: "Prompt",
      cell: (r) => <span className="line-clamp-1 max-w-xs text-sm text-muted-foreground">{r.prompt}</span>,
    },
    { key: "tokens", header: "Tokens", className: "text-right", cell: (r) => <span className="text-sm tabular-nums">{r.total_tokens}</span> },
    {
      key: "created_at",
      header: "When",
      cell: (r) => <span className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>,
    },
  ];

  const items = data?.page.items ?? [];
  const totalPages = data?.page.pages ?? 1;

  return (
    <div className="space-y-6">
      <AdminPageHeader title="AI Usage" subtitle="Orbit AI assistant calls, token spend, and rate limits — live data." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total calls" value={data ? formatCompact(data.stats.total_calls) : "—"} icon={MessageCircle} />
        <StatCard label="Total tokens" value={data ? formatCompact(data.stats.total_tokens) : "—"} icon={Coins} />
        <StatCard label="Rate limit" value={data ? `${data.stats.rate_limit_per_minute}/min per user` : "—"} icon={Gauge} />
      </div>

      <DataTable
        columns={columns}
        data={items}
        emptyTitle="No AI usage yet"
        emptyDescription="Calls to the Orbit AI assistant will show up here as customers use it."
      />

      {!isLoading && data && data.page.total > pageSize && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {data.page.page} of {totalPages} · {data.page.total} total
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
