import { useState } from "react";
import { Users, Building2, PlugZap, ArrowLeftRight, Download } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { ProviderStatusCard } from "@/components/admin/ProviderStatusCard";
import { RiskBadge } from "@/components/admin/RiskBadge";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { MetricChart } from "@/components/admin/MetricChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  overviewStats,
  providerHealth,
  recentActivity,
  riskAlerts,
  transactionChartData,
} from "@/lib/mock-data";
import { formatCompact } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import type { ChartPoint } from "@/lib/mock-data";

const iconByKey = { users: Users, businesses: Building2, providers: PlugZap, synced: ArrowLeftRight };

const chartConfig: Record<string, { key: keyof Omit<ChartPoint, "label">; fmt?: (v: number) => string }> = {
  transactions: { key: "transactions" },
  volume: { key: "volume", fmt: (v) => `Rs. ${v}L` },
  businesses: { key: "businesses" },
};

export default function OverviewPage() {
  const [range, setRange] = useState("7d");
  const [chartTab, setChartTab] = useState<keyof typeof chartConfig>("transactions");
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Overview"
        subtitle="Monitor Orbit's financial ecosystem."
        actions={<DateRangeFilter value={range} onChange={setRange} />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((s) => (
          <StatCard
            key={s.key}
            label={s.label}
            value={s.value}
            change={s.change}
            comparison={s.comparison}
            icon={iconByKey[s.key as keyof typeof iconByKey]}
          />
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Transaction Activity</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Normalized platform activity over time.</p>
          </div>
          <Tabs value={chartTab} onValueChange={(v) => setChartTab(v as keyof typeof chartConfig)}>
            <TabsList>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
              <TabsTrigger value="businesses">Active Businesses</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <MetricChart
            data={transactionChartData}
            dataKey={chartConfig[chartTab].key}
            formatter={chartConfig[chartTab].fmt}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Provider Health</h2>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/admin/system")}>
              View all
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {providerHealth.map((p) => (
              <ProviderStatusCard key={p.id} provider={p} />
            ))}
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Risk Alerts</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/admin/risk")}>
              View all alerts
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {riskAlerts.slice(0, 3).map((alert, i) => (
              <div key={alert.id}>
                {i > 0 && <Separator className="my-1" />}
                <div className="flex items-start gap-3 py-2">
                  <RiskBadge level={alert.level} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{alert.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{alert.business} · {alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Recent Platform Activity</CardTitle>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate("/admin/audit")}>
            <Download className="h-4 w-4" /> Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            <ActivityFeed items={recentActivity.slice(0, 3)} />
            <ActivityFeed items={recentActivity.slice(3, 6)} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
