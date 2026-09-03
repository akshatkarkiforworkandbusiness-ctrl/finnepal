import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, CheckCircle2, Clock3, Ban, Eye, ShieldCheck } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { SearchInput } from "@/components/admin/SearchInput";
import { FilterBar } from "@/components/admin/FilterBar";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { RowActionButton } from "@/components/admin/RowActionButton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { businesses } from "@/lib/mock-data";
import type { Business } from "@/types";
import { toast } from "@/components/ui/sonner";

const activityTone = { High: "text-emerald-600", Medium: "text-amber-600", Low: "text-slate-500" };

export default function BusinessesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [suspendBusiness, setSuspendBusiness] = useState<Business | null>(null);

  const filtered = useMemo(
    () =>
      businesses.filter(
        (b) =>
          (type === "all" || b.type === type) &&
          (status === "all" || b.status.toLowerCase() === status) &&
          (b.name.toLowerCase().includes(search.toLowerCase()) || b.owner.toLowerCase().includes(search.toLowerCase()))
      ),
    [search, type, status]
  );

  const stats = [
    { label: "Total businesses", value: String(businesses.length), change: 8.1, icon: Building2 },
    { label: "Active", value: String(businesses.filter((b) => b.status === "Active").length), change: 4.2, icon: CheckCircle2 },
    { label: "Pending verification", value: String(businesses.filter((b) => b.status === "Pending").length), change: -1.3, icon: Clock3 },
    { label: "Suspended", value: String(businesses.filter((b) => b.status === "Suspended").length), change: 0.4, icon: Ban },
  ];

  const columns: Column<Business>[] = [
    { key: "business", header: "Business", cell: (b) => <span className="text-sm font-medium">{b.name}</span> },
    { key: "owner", header: "Owner", cell: (b) => <span className="text-sm text-muted-foreground">{b.owner}</span> },
    { key: "type", header: "Type", cell: (b) => <Badge variant="secondary">{b.type}</Badge> },
    { key: "location", header: "Location", cell: (b) => <span className="text-sm text-muted-foreground">{b.location}</span> },
    { key: "activity", header: "Activity", cell: (b) => <span className={`text-sm font-medium ${activityTone[b.activity]}`}>{b.activity}</span> },
    { key: "providers", header: "Providers", cell: (b) => <span className="text-sm tabular-nums">{b.providers}</span> },
    { key: "status", header: "Status", cell: (b) => <StatusBadge status={b.status} /> },
    {
      key: "actions",
      header: "",
      className: "w-20 text-right",
      cell: (b) => (
        <div className="flex items-center justify-end gap-1">
          <RowActionButton icon={Eye} label="View" onClick={() => navigate(`/admin/businesses/${b.id}`)} />
          {b.status === "Suspended" ? (
            <RowActionButton icon={ShieldCheck} label="Reinstate" onClick={() => setSuspendBusiness(b)} />
          ) : (
            <RowActionButton icon={Ban} label="Suspend" destructive onClick={() => setSuspendBusiness(b)} />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Businesses" subtitle="Monitor registered businesses across the Orbit network." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} change={s.change} comparison="from last month" icon={s.icon} />
        ))}
      </div>

      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search businesses or owners" className="sm:w-72" />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="sm:w-40"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {[...new Set(businesses.map((b) => b.type))].map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground sm:ml-auto">{filtered.length} businesses</span>
      </FilterBar>

      <DataTable columns={columns} data={filtered} onRowClick={(b) => navigate(`/admin/businesses/${b.id}`)} />

      <ConfirmDialog
        open={!!suspendBusiness}
        onOpenChange={(o) => !o && setSuspendBusiness(null)}
        title={suspendBusiness?.status === "Suspended" ? `Reinstate ${suspendBusiness?.name}?` : `Suspend ${suspendBusiness?.name}?`}
        description={
          suspendBusiness?.status === "Suspended"
            ? "The business will regain access to Orbit. This is a prototype action and no real account is affected."
            : "The business will lose access to Orbit until reinstated. This is a prototype action and no real account is affected."
        }
        confirmLabel={suspendBusiness?.status === "Suspended" ? "Reinstate business" : "Suspend business"}
        destructive={suspendBusiness?.status !== "Suspended"}
        onConfirm={() =>
          toast.success(suspendBusiness?.status === "Suspended" ? `${suspendBusiness?.name} reinstated` : `${suspendBusiness?.name} suspended`)
        }
      />
    </div>
  );
}
