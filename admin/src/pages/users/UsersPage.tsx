import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Eye, MoreHorizontal, UserX } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SearchInput } from "@/components/admin/SearchInput";
import { FilterBar } from "@/components/admin/FilterBar";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { UserAvatar } from "@/components/admin/UserAvatar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { users } from "@/mock/users";
import type { User } from "@/types";
import { toast } from "@/components/ui/sonner";

export default function UsersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [kyc, setKyc] = useState("all");
  const [sort, setSort] = useState("newest");
  const [suspendUser, setSuspendUser] = useState<User | null>(null);

  const filtered = useMemo(() => {
    let list = users.filter(
      (u) =>
        (status === "all" || u.status.toLowerCase() === status) &&
        (kyc === "all" || u.kyc.toLowerCase() === kyc) &&
        (u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.business.toLowerCase().includes(search.toLowerCase()) ||
          u.id.toLowerCase().includes(search.toLowerCase()))
    );
    if (sort === "active") list = [...list].sort((a, b) => b.transactions - a.transactions);
    if (sort === "oldest") list = [...list].reverse();
    return list;
  }, [search, status, kyc, sort]);

  const columns: Column<User>[] = [
    { key: "id", header: "User ID", cell: (u) => <span className="font-mono text-xs text-muted-foreground">{u.id}</span> },
    { key: "user", header: "Name", cell: (u) => <UserAvatar name={u.name} subtitle={u.email} /> },
    { key: "business", header: "Business", cell: (u) => <span className="text-sm">{u.business}</span> },
    { key: "phone", header: "Phone", cell: (u) => <span className="text-sm text-muted-foreground">{u.phone}</span> },
    { key: "kyc", header: "KYC", cell: (u) => <StatusBadge status={u.kyc} /> },
    { key: "providers", header: "Connected Accounts", cell: (u) => <span className="text-sm tabular-nums">{u.providers}</span> },
    { key: "lastActive", header: "Last Active", cell: (u) => <span className="text-sm text-muted-foreground">{u.lastActive}</span> },
    { key: "status", header: "Status", cell: (u) => <StatusBadge status={u.status} /> },
    { key: "joined", header: "Created", cell: (u) => <span className="text-sm text-muted-foreground">{u.joined}</span> },
    {
      key: "actions",
      header: "",
      className: "w-12 text-right",
      cell: (u) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => navigate(`/admin/users/${u.id}`)}>
              <Eye className="h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[#C5161D] focus:text-[#C5161D]" onClick={() => setSuspendUser(u)}>
              <UserX className="h-4 w-4" /> Suspend
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users"
        subtitle="Manage Orbit users and their account activity."
        actions={
          <Button variant="outline" className="gap-2" onClick={() => toast("Export started", { description: "Users export queued." })}>
            <Download className="h-4 w-4" /> Export
          </Button>
        }
      />

      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search users or businesses" className="sm:w-72" />
        <Select value={kyc} onValueChange={setKyc}>
          <SelectTrigger className="sm:w-40"><SelectValue placeholder="KYC" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All KYC</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="review required">Review Required</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="sm:w-40"><SelectValue placeholder="Sort" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="active">Most active</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground sm:ml-auto">{filtered.length} users</span>
      </FilterBar>

      <DataTable columns={columns} data={filtered} onRowClick={(u) => navigate(`/admin/users/${u.id}`)} />

      <ConfirmDialog
        open={!!suspendUser}
        onOpenChange={(o) => !o && setSuspendUser(null)}
        title={`Suspend ${suspendUser?.name}?`}
        description="The user will lose access to Orbit until reinstated. This is a prototype action and no real account is affected."
        confirmLabel="Suspend user"
        destructive
        onConfirm={() => toast.success(`${suspendUser?.name} suspended`)}
      />
    </div>
  );
}
