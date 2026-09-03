import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, TrendingUp, CheckCircle2, XCircle, Eye } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { SearchInput } from "@/components/admin/SearchInput";
import { FilterBar } from "@/components/admin/FilterBar";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ProviderBadge } from "@/components/admin/ProviderLogo";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { transactions } from "@/lib/mock-data";
import type { Transaction } from "@/types";
import { formatCurrency } from "@/lib/utils";

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(
    () =>
      transactions.filter(
        (t) =>
          (provider === "all" || t.provider === provider) &&
          (status === "all" || t.status.toLowerCase() === status) &&
          (t.id.toLowerCase().includes(search.toLowerCase()) || t.business.toLowerCase().includes(search.toLowerCase()))
      ),
    [search, provider, status]
  );

  const stats = [
    { label: "Transactions today", value: "6,420", change: 6.4, icon: ArrowLeftRight },
    { label: "Volume today", value: "Rs. 4.8 Cr", change: 9.1, icon: TrendingUp },
    { label: "Successful", value: "99.2%", change: 0.3, icon: CheckCircle2 },
    { label: "Failed", value: "0.8%", change: -0.2, icon: XCircle },
  ];

  const columns: Column<Transaction>[] = [
    { key: "id", header: "Transaction ID", cell: (t) => <span className="font-mono text-sm font-medium">{t.id}</span> },
    { key: "date", header: "Date", cell: (t) => <span className="text-sm text-muted-foreground">{t.date}</span> },
    { key: "business", header: "Business", cell: (t) => <span className="text-sm">{t.business}</span> },
    { key: "provider", header: "Provider", cell: (t) => <ProviderBadge provider={t.provider} /> },
    { key: "type", header: "Type", cell: (t) => <span className="text-sm text-muted-foreground">{t.type}</span> },
    { key: "amount", header: "Amount", className: "text-right", cell: (t) => <span className="text-sm font-semibold tabular-nums">Rs. {formatCurrency(t.amount)}</span> },
    { key: "status", header: "Status", cell: (t) => <StatusBadge status={t.status} /> },
    { key: "source", header: "Source", cell: (t) => <span className="text-sm text-muted-foreground">{t.source}</span> },
    {
      key: "actions",
      header: "",
      className: "w-12 text-right",
      cell: (t) => (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); navigate(`/admin/transactions/${t.id}`); }}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Transactions" subtitle="Monitor normalized financial activity across Orbit." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} change={s.change} comparison="vs yesterday" icon={s.icon} />
        ))}
      </div>

      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Transaction ID or business" className="sm:w-72" />
        <Select value={provider} onValueChange={setProvider}>
          <SelectTrigger className="sm:w-40"><SelectValue placeholder="Provider" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All providers</SelectItem>
            {[...new Set(transactions.map((t) => t.provider))].map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground sm:ml-auto">{filtered.length} transactions</span>
      </FilterBar>

      <DataTable columns={columns} data={filtered} onRowClick={(t) => navigate(`/admin/transactions/${t.id}`)} />
    </div>
  );
}
