import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SyncStatus } from "@/components/admin/SyncStatus";
import { MetricChart } from "@/components/admin/MetricChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getProviderById, transactionChartData } from "@/lib/mock-data";
import { toast } from "@/components/ui/sonner";

export default function ProviderDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const p = getProviderById(id);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={() => navigate("/admin/providers")}>
        <ArrowLeft className="h-4 w-4" /> Back to providers
      </Button>

      <AdminPageHeader
        title={p.name}
        subtitle={p.category}
        actions={
          <Button variant="outline" className="gap-2" onClick={() => toast.success("Sync triggered", { description: `${p.name} re-sync queued.` })}>
            <RefreshCcw className="h-4 w-4" /> Trigger sync
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Status</CardTitle>
            <StatusBadge status={p.status} />
          </CardHeader>
          <CardContent className="space-y-4">
            <SyncStatus status={p.status} lastSync={p.lastSync} />
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Uptime</span><span className="font-medium tabular-nums">{p.uptime}%</span></div>
              <Progress value={p.uptime} />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Success rate</span><span className="font-medium tabular-nums">{p.successRate}%</span></div>
              <Progress value={p.successRate} />
            </div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Connections</span><span className="font-medium tabular-nums">{p.connections.toLocaleString()}</span></div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Sync volume</CardTitle></CardHeader>
          <CardContent><MetricChart data={transactionChartData} dataKey="transactions" /></CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">API secrets and credentials for this provider are stored securely and never displayed in the admin console.</p>
    </div>
  );
}
