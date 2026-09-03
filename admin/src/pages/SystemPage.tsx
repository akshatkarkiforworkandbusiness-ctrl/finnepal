import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProviderStatusCard } from "@/components/admin/ProviderStatusCard";
import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { providers } from "@/lib/mock-data";
import { Activity, Server, Database, Cpu } from "lucide-react";

const systemMetrics = [
  { label: "API latency (p95)", value: 42, display: "142 ms", icon: Activity },
  { label: "Sync queue load", value: 28, display: "28%", icon: Database },
  { label: "Worker CPU", value: 61, display: "61%", icon: Cpu },
  { label: "Storage used", value: 47, display: "47%", icon: Server },
];

export default function SystemPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Provider Health" subtitle="Real-time health of Orbit infrastructure and provider adapters." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="System uptime" value="99.98%" change={0.1} comparison="last 30 days" icon={Activity} />
        <StatCard label="Active workers" value="24" change={0} comparison="all healthy" icon={Cpu} />
        <StatCard label="Syncs / min" value="1,240" change={4.6} comparison="vs last hour" icon={Database} />
        <StatCard label="Error rate" value="0.4%" change={-0.1} comparison="last hour" icon={Server} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Infrastructure metrics</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {systemMetrics.map((m) => (
              <div key={m.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground"><m.icon className="h-4 w-4" /> {m.label}</span>
                  <span className="font-medium tabular-nums">{m.display}</span>
                </div>
                <Progress value={m.value} />
              </div>
            ))}
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-3 text-base font-semibold">Provider adapters</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {providers.map((p) => (
              <ProviderStatusCard key={p.id} provider={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
