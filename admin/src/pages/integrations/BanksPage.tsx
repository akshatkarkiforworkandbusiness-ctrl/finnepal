import { useQuery } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ProviderBadge } from "@/components/admin/ProviderLogo";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import type { ProviderAdmin } from "@/types/api";

export default function BanksPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "providers"],
    queryFn: () => api.get<ProviderAdmin[]>("/admin/providers"),
  });

  const banks = (data ?? []).filter((p) => p.category === "BANK");

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Banks" subtitle="Connected bank integrations — live health from the provider catalog." />
      <Card>
        {isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading…</p>
        ) : banks.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No bank providers in the catalog yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Bank</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Health</TableHead>
                <TableHead className="text-right">Uptime</TableHead>
                <TableHead className="text-right">Success rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banks.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <ProviderBadge provider={b.code} label={b.name} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={b.availability} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={b.health_status ?? "unknown"} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {b.uptime !== null ? `${b.uptime}%` : "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {b.success_rate !== null ? `${b.success_rate}%` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
      <p className="text-xs text-muted-foreground">
        Nepal has no public open-banking API, so bank connections run in DEMO mode (synthetic transaction data,
        always tagged accordingly) — same model real aggregators like Plaid use before a bank exposes a real feed.
      </p>
    </div>
  );
}
