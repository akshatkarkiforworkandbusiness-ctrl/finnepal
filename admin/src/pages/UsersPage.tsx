import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Eye, UserCheck, UserX } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SearchInput } from "@/components/admin/SearchInput";
import { FilterBar } from "@/components/admin/FilterBar";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { UserAvatar } from "@/components/admin/UserAvatar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { RowActionButton } from "@/components/admin/RowActionButton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { users } from "@/lib/mock-data";
import type { User } from "@/types";
import { toast } from "@/components/ui/sonner";

export default function UsersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [suspendUser, setSuspendUser] = useState<User | null>(null);

  const filtered = useMemo(() => {
    let list = users.filter(
      (u) =>
        (status === "all" || u.status.toLowerCase() === status) &&
        (u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.business.toLowerCase().includes(search.toLowerCase()))
    );
    if (sort === "active") list = [...list].sort((a, b) => b.transactions - a.transactions);
    if (sort === "oldest") list = [...list].reverse();
    return list;
  }, [search, status, sort]);

  const columns: Column<User>[] = [
    { key: "user", header: "User", cell: (u) => <UserAvatar name={u.name} subtitle={u.email} /> },
    { key: "business", header: "Business", cell: (u) => <span className="text-sm">{u.business}</span> },
    { key: "status", header: "Status", cell: (u) => <StatusBadge status={u.status} /> },
    { key: "providers", header: "Providers", cell: (u) => <span className="text-sm tabular-nums">{u.providers} providers</span> },
    { key: "lastActive", header: "Last active", cell: (u) => <span className="text-sm text-muted-foreground">{u.lastActive}</span> },
    { key: "joined", header: "Joined", cell: (u) => <span className="text-sm text-muted-foreground">{u.joined}</span> },
    {
      key: "actions",
      header: "",
      className: "w-20 text-right",
      cell: (u) => (
        <div className="flex items-center justify-end gap-1">
          <RowActionButton icon={Eye} label="View" onClick={() => navigate(`/admin/users/${u.id}`)} />
          {u.status === "Suspended" ? (
            <RowActionButton icon={UserCheck} label="Reinstate" onClick={() => setSuspendUser(u)} />
          ) : (
            <RowActionButton icon={UserX} label="Suspend" destructive onClick={() => setSuspendUser(u)} />
          )}
        </div>
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
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
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
        title={suspendUser?.status === "Suspended" ? `Reinstate ${suspendUser?.name}?` : `Suspend ${suspendUser?.name}?`}
        description={
          suspendUser?.status === "Suspended"
            ? "The user will regain access to Orbit. This is a prototype action and no real account is affected."
            : "The user will lose access to Orbit until reinstated. This is a prototype action and no real account is affected."
        }
        confirmLabel={suspendUser?.status === "Suspended" ? "Reinstate user" : "Suspend user"}
        destructive={suspendUser?.status !== "Suspended"}
        onConfirm={() =>
          toast.success(suspendUser?.status === "Suspended" ? `${suspendUser?.name} reinstated` : `${suspendUser?.name} suspended`)
        }
      />
    </div>
  );
}
