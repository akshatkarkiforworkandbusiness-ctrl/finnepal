import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProviderStatusCard } from "@/components/admin/ProviderStatusCard";
import { StatCard } from "@/components/admin/StatCard";
import { providers } from "@/lib/mock-data";
import { PlugZap, CheckCircle2, AlertTriangle, Activity } from "lucide-react";

export default function ProvidersPage() {
  const stats = [
    { label: "Connected providers", value: "13,890", change: 5.7, icon: PlugZap },
    { label: "Healthy", value: String(providers.filter((p) => p.status === "Healthy").length), change: 1.2, icon: CheckCircle2 },
    { label: "Warnings", value: String(providers.filter((p) => p.status === "Warning").length), change: -0.5, icon: AlertTriangle },
    { label: "Avg uptime", value: "99.4%", change: 0.2, icon: Activity },
  ];
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Provider Connections" subtitle="Track financial provider adapters powering Orbit sync." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} change={s.change} comparison="from last month" icon={s.icon} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {providers.map((p) => (
          <ProviderStatusCard key={p.id} provider={p} />
        ))}
      </div>
    </div>
  );
}
