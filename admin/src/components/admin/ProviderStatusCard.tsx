import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { SyncStatus } from "./SyncStatus";
import { Progress } from "@/components/ui/progress";
import type { Provider } from "@/types";
import { useNavigate } from "react-router-dom";
import { Server } from "lucide-react";

export function ProviderStatusCard({ provider }: { provider: Provider }) {
  const navigate = useNavigate();
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-primary">
            <Server className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{provider.name}</p>
            <p className="text-xs text-muted-foreground">{provider.category}</p>
          </div>
        </div>
        <StatusBadge status={provider.status} />
      </div>
      <div className="mt-3">
        <SyncStatus status={provider.status} lastSync={provider.lastSync} />
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Success rate</span>
          <span className="font-medium tabular-nums text-foreground">{provider.successRate}%</span>
        </div>
        <Progress value={provider.successRate} />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground tabular-nums">{provider.connections.toLocaleString()} connections</span>
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => navigate("/admin/integrations/payments")}>
          Details
        </Button>
      </div>
    </Card>
  );
}
