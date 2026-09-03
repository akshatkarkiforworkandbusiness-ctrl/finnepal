import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RiskBadge } from "@/components/admin/RiskBadge";
import { StatCard } from "@/components/admin/StatCard";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { RowActionButton } from "@/components/admin/RowActionButton";
import { supportTickets } from "@/lib/mock-data";
import type { SupportTicket } from "@/types";
import { LifeBuoy, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const priorityLevel = { Urgent: "High", High: "High", Normal: "Medium", Low: "Low" } as const;

export default function SupportPage() {
  const [resolveTarget, setResolveTarget] = useState<SupportTicket | null>(null);

  const stats = [
    { label: "Open tickets", value: String(supportTickets.filter((t) => t.status === "Open").length), change: 2.1, icon: LifeBuoy },
    { label: "Pending", value: String(supportTickets.filter((t) => t.status === "Pending").length), change: -1.0, icon: Clock },
    { label: "Resolved (7d)", value: "42", change: 12.5, icon: CheckCircle2 },
  ];

  const columns: Column<SupportTicket>[] = [
    { key: "id", header: "Ticket", cell: (t) => <span className="font-mono text-sm font-medium">{t.id}</span> },
    { key: "subject", header: "Subject", cell: (t) => <span className="text-sm">{t.subject}</span> },
    { key: "user", header: "User", cell: (t) => <span className="text-sm text-muted-foreground">{t.user}</span> },
    { key: "priority", header: "Priority", cell: (t) => <RiskBadge level={priorityLevel[t.priority]} /> },
    { key: "assignee", header: "Assignee", cell: (t) => <span className="text-sm text-muted-foreground">{t.assignee}</span> },
    { key: "status", header: "Status", cell: (t) => <StatusBadge status={t.status} /> },
    { key: "updated", header: "Updated", cell: (t) => <span className="text-sm text-muted-foreground">{t.updated}</span> },
    {
      key: "actions",
      header: "",
      className: "w-12 text-right",
      cell: (t) =>
        t.status === "Resolved" ? null : (
          <div className="flex items-center justify-end">
            <RowActionButton icon={CheckCircle2} label="Resolve" onClick={() => setResolveTarget(t)} />
          </div>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Support Tickets" subtitle="Resolve customer issues and provider incidents." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} change={s.change} comparison="this week" icon={s.icon} />
        ))}
      </div>
      <DataTable columns={columns} data={supportTickets} />

      <ConfirmDialog
        open={!!resolveTarget}
        onOpenChange={(o) => !o && setResolveTarget(null)}
        title={`Resolve ${resolveTarget?.id}?`}
        description="The ticket will be marked resolved and closed. This is a prototype action and no real ticket is affected."
        confirmLabel="Resolve ticket"
        onConfirm={() => toast.success(`${resolveTarget?.id} marked as resolved`)}
      />
    </div>
  );
}
