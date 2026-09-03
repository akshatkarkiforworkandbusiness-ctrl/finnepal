import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, CheckCircle2, Clock3, Ban, Eye, MoreHorizontal } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { SearchInput } from "@/components/admin/SearchInput";
import { FilterBar } from "@/components/admin/FilterBar";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { businesses } from "@/mock/businesses";
import { transactions } from "@/mock/transactions";
import type { Business } from "@/types";
import { formatCurrency } from "@/lib/utils";

export default function BusinessesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(
    () =>
      businesses.filter(
        (b) =>
          (category === "all" || b.category === category) &&
          (status === "all" || b.status.toLowerCase() === status) &&
          (b.name.toLowerCase().includes(search.toLowerCase()) || b.owner.toLowerCase().includes(search.toLowerCase()))
      ),
    [search, category, status]
  );

  const stats = [
    { label: "Total businesses", value: String(businesses.length), change: 8.1, icon: Building2 },
    { label: "Active", value: String(businesses.filter((b) => b.status === "Active").length), change: 4.2, icon: CheckCircle2 },
    { label: "Pending verification", value: String(businesses.filter((b) => b.status === "Pending").length), change: -1.3, icon: Clock3 },
    { label: "Suspended", value: String(businesses.filter((b) => b.status === "Suspended").length), change: 0.4, icon: Ban },
  ];

  const columns: Column<Business>[] = [
    { key: "business", header: "Business Name", cell: (b) => <span className="text-sm font-medium">{b.name}</span> },
    { key: "owner", header: "Owner", cell: (b) => <span className="text-sm text-muted-foreground">{b.owner}</span> },
    { key: "category", header: "Category", cell: (b) => <Badge variant="secondary">{b.category}</Badge> },
    { key: "location", header: "Location", cell: (b) => <span className="text-sm text-muted-foreground">{b.location}</span> },
    {
      key: "transactions",
      header: "Transactions",
      cell: (b) => <span className="text-sm tabular-nums">{transactions.filter((t) => t.businessId === b.id).length}</span>,
    },
    {
      key: "monthlyVolume",
      header: "Monthly Volume",
      cell: (b) => <span className="text-sm font-medium tabular-nums">NPR {formatCurrency(b.monthlyVolume)}</span>,
    },
    { key: "providers", header: "Connected Sources", cell: (b) => <span className="text-sm tabular-nums">{b.providers}</span> },
    { key: "kyc", header: "KYC", cell: (b) => <StatusBadge status={b.kyc} /> },
    { key: "status", header: "Status", cell: (b) => <StatusBadge status={b.status} /> },
    {
      key: "actions",
      header: "",
      className: "w-12 text-right",
      cell: (b) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => navigate(`/admin/businesses/${b.id}`)}>
              <Eye className="h-4 w-4" /> View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="sm:w-40"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {[...new Set(businesses.map((b) => b.category))].map((t) => (
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
    </div>
  );
}
