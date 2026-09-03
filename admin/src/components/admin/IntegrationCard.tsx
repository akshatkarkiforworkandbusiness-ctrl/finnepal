import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";

interface IntegrationCardProps {
  name: string;
  status: string;
  environment?: "Sandbox" | "Production";
  connectedBusinesses: number;
  transactions?: number;
  value?: string;
  successRate?: number;
  lastSync: string;
  onConfigure?: () => void;
  onTest?: () => void;
  onViewLogs?: () => void;
  onDisable?: () => void;
  className?: string;
}

export function IntegrationCard({
  name,
  status,
  environment,
  connectedBusinesses,
  transactions,
  value,
  successRate,
  lastSync,
  onConfigure,
  onTest,
  onViewLogs,
  onDisable,
  className,
}: IntegrationCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Last sync {lastSync}</p>
        </div>
        <div className="flex items-center gap-2">
          {environment && (
            <StatusBadge status={environment} withDot={false} className="text-[10px] uppercase" />
          )}
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div>
          <p className="text-xs text-muted-foreground">Businesses</p>
          <p className="font-semibold tabular-nums text-foreground">{connectedBusinesses.toLocaleString()}</p>
        </div>
        {transactions !== undefined && (
          <div>
            <p className="text-xs text-muted-foreground">Transactions</p>
            <p className="font-semibold tabular-nums text-foreground">{transactions.toLocaleString()}</p>
          </div>
        )}
        {value && (
          <div>
            <p className="text-xs text-muted-foreground">Value</p>
            <p className="font-semibold tabular-nums text-foreground">{value}</p>
          </div>
        )}
        {successRate !== undefined && (
          <div>
            <p className="text-xs text-muted-foreground">Success rate</p>
            <p className="font-semibold tabular-nums text-foreground">{successRate}%</p>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      <div className="flex flex-wrap gap-2">
        {onConfigure && (
          <Button variant="outline" size="sm" onClick={onConfigure}>
            Configure
          </Button>
        )}
        {onTest && (
          <Button variant="outline" size="sm" onClick={onTest}>
            Test Connection
          </Button>
        )}
        {onViewLogs && (
          <Button variant="outline" size="sm" onClick={onViewLogs}>
            View Logs
          </Button>
        )}
        {onDisable && (
          <Button variant="ghost" size="sm" className="text-[#C5161D] hover:text-[#C5161D]" onClick={onDisable}>
            Disable
          </Button>
        )}
      </div>
    </Card>
  );
}
