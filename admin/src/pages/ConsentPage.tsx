import { useState } from "react";
import { Ban } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConsentBadge } from "@/components/admin/ConsentBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { RowActionButton } from "@/components/admin/RowActionButton";
import { Badge } from "@/components/ui/badge";
import { consents } from "@/lib/mock-data";
import type { Consent } from "@/types";
import { toast } from "@/components/ui/sonner";

export default function ConsentPage() {
  const [revokeTarget, setRevokeTarget] = useState<Consent | null>(null);

  const columns: Column<Consent>[] = [
    { key: "user", header: "User", cell: (c) => <span className="text-sm font-medium">{c.user}</span> },
    { key: "business", header: "Business", cell: (c) => <span className="text-sm text-muted-foreground">{c.business}</span> },
    { key: "provider", header: "Provider", cell: (c) => <Badge variant="secondary">{c.provider}</Badge> },
    { key: "scope", header: "Scope", cell: (c) => <span className="text-sm text-muted-foreground">{c.scope}</span> },
    { key: "granted", header: "Granted", cell: (c) => <span className="text-sm text-muted-foreground">{c.granted}</span> },
    { key: "expires", header: "Expires", cell: (c) => <span className="text-sm text-muted-foreground">{c.expires}</span> },
    { key: "status", header: "Status", cell: (c) => <ConsentBadge status={c.status} /> },
    {
      key: "actions",
      header: "",
      className: "w-12 text-right",
      cell: (c) =>
        c.status === "Revoked" ? null : (
          <div className="flex items-center justify-end">
            <RowActionButton icon={Ban} label="Revoke" destructive onClick={() => setRevokeTarget(c)} />
          </div>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Consent" subtitle="Track data-sharing consent between users and connected providers." />
      <DataTable columns={columns} data={consents} />
      <p className="text-xs text-muted-foreground">Consent records define the scope of data Orbit may access — never authentication credentials.</p>

      <ConfirmDialog
        open={!!revokeTarget}
        onOpenChange={(o) => !o && setRevokeTarget(null)}
        title={`Revoke ${revokeTarget?.provider} access for ${revokeTarget?.user}?`}
        description="The provider will lose access to this scope immediately. This is a prototype action and no real consent is affected."
        confirmLabel="Revoke consent"
        destructive
        onConfirm={() => toast.success(`Revoked ${revokeTarget?.provider} access for ${revokeTarget?.user}`)}
      />
    </div>
  );
}
