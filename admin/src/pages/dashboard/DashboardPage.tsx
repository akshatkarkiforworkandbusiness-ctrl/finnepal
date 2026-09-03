import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Building2,
  ArrowLeftRight,
  Link2,
  Wallet,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  Line,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ProviderBadge } from "@/components/admin/ProviderLogo";
import { ChartTooltip } from "@/components/admin/ChartTooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import type {
  OverviewStats,
  Page,
  TransactionAdmin,
  ProviderAdmin,
  BusinessAdmin,
  UserAdmin,
  RiskAlertAdmin,
} from "@/types/api";

const statusColors: Record<string, string> = {
  COMPLETED: "#0B3D2E",
  PENDING: "#D97706",
  FAILED: "#C5161D",
  FLAGGED: "#C5161D",
};

const categoryColors = ["#0B3D2E", "#1F6D4C", "#3D8B68", "#6BAF8D", "#A8CCB8", "#94A3B8", "#CBD5E1"];

function formatCompact(n: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const overviewQuery = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => api.get<OverviewStats>("/admin/overview"),
  });
  const transactionsQuery = useQuery({
    queryKey: ["admin", "transactions", "dashboard"],
    queryFn: () => api.get<Page<TransactionAdmin>>("/admin/transactions", { page: 1, page_size: 100 }),
  });
  const providersQuery = useQuery({
    queryKey: ["admin", "providers"],
    queryFn: () => api.get<ProviderAdmin[]>("/admin/providers"),
  });
  const businessesQuery = useQuery({
    queryKey: ["admin", "businesses", "dashboard"],
    queryFn: () => api.get<Page<BusinessAdmin>>("/admin/businesses", { page: 1, page_size: 100 }),
  });
  const usersQuery = useQuery({
    queryKey: ["admin", "users", "dashboard"],
    queryFn: () => api.get<Page<UserAdmin>>("/admin/users", { page: 1, page_size: 100 }),
  });
  const riskAlertsQuery = useQuery({
    queryKey: ["admin", "risk-alerts", "dashboard"],
    queryFn: () => api.get<Page<RiskAlertAdmin>>("/admin/risk-alerts", { page: 1, page_size: 5 }),
  });

  const isLoading =
    overviewQuery.isLoading || transactionsQuery.isLoading || providersQuery.isLoading || businessesQuery.isLoading || usersQuery.isLoading;

  const stats = overviewQuery.data;

  const kpis = useMemo(
    () => [
      { label: "Total Users", value: stats ? formatCompact(stats.total_users) : "—", icon: Users },
      { label: "Active Businesses", value: stats ? formatCompact(stats.total_businesses) : "—", icon: Building2 },
      { label: "Total Transactions", value: stats ? formatCompact(stats.total_transactions) : "—", icon: ArrowLeftRight },
      { label: "Connected Providers", value: stats ? formatCompact(stats.total_providers_connected) : "—", icon: Link2 },
      { label: "Net Cash Flow", value: stats ? `Rs. ${formatCompact(stats.net_cash_flow)}` : "—", icon: Wallet },
      { label: "Open Risk Alerts", value: stats ? formatCompact(stats.open_risk_alerts) : "—", icon: ShieldAlert },
    ],
    [stats]
  );

  // Transactions per day (last 14 days present in the fetched page), for the
  // volume chart, and a status breakdown for the pie — both derived from
  // real rows, not invented.
  const { dailySeries, statusBreakdown } = useMemo(() => {
    const rows = transactionsQuery.data?.items ?? [];
    const byDay = new Map<string, { count: number; volume: number }>();
    const byStatus = new Map<string, number>();

    for (const t of rows) {
      const day = t.occurred_at.slice(0, 10);
      const entry = byDay.get(day) ?? { count: 0, volume: 0 };
      entry.count += 1;
      entry.volume += Math.abs(t.amount);
      byDay.set(day, entry);

      byStatus.set(t.status, (byStatus.get(t.status) ?? 0) + 1);
    }

    const dailySeries = Array.from(byDay.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([day, v]) => ({ label: day.slice(5), transactions: v.count, volume: Math.round(v.volume) }));

    const statusBreakdown = Array.from(byStatus.entries()).map(([status, count]) => ({ status, count }));

    return { dailySeries, statusBreakdown };
  }, [transactionsQuery.data]);

  const businessesByCategory = useMemo(() => {
    const rows = businessesQuery.data?.items ?? [];
    const byType = new Map<string, number>();
    for (const b of rows) byType.set(b.type, (byType.get(b.type) ?? 0) + 1);
    return Array.from(byType.entries()).map(([category, count]) => ({ category, count }));
  }, [businessesQuery.data]);

  const userStatusBreakdown = useMemo(() => {
    const rows = usersQuery.data?.items ?? [];
    const byStatus = new Map<string, number>();
    for (const u of rows) byStatus.set(u.status, (byStatus.get(u.status) ?? 0) + 1);
    return Array.from(byStatus.entries()).map(([status, count]) => ({ status, count }));
  }, [usersQuery.data]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin"] });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        subtitle="Orbit platform overview — live data."
        actions={
          <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={isLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpis.map((kpi) => (
          <StatCard key={kpi.label} label={kpi.label} value={kpi.value} icon={kpi.icon} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
        <div className="lg:col-span-4">
          <ChartCard title="Transaction Volume" description="Most recent 100 transactions, grouped by day.">
            {dailySeries.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No transactions yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={dailySeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(214 20% 90%)" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(215 15% 45%)" }} />
                  <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(215 15% 45%)" }} width={40} />
                  <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(215 15% 45%)" }} width={44} />
                  <Tooltip content={<ChartTooltip formatter={(v) => v.toLocaleString()} />} />
                  <Bar yAxisId="left" dataKey="transactions" name="Transaction Count" fill="#0B3D2E" radius={[3, 3, 0, 0]} barSize={18} isAnimationActive={false} />
                  <Line yAxisId="right" type="monotone" dataKey="volume" name="Volume" stroke="#6BAF8D" strokeWidth={2} dot={false} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        <div className="lg:col-span-3">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground">Transaction Status</h3>
            {statusBreakdown.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No transactions yet.</p>
            ) : (
              <>
                <div className="relative mx-auto mt-2 h-48 w-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusBreakdown} dataKey="count" nameKey="status" innerRadius={58} outerRadius={78} paddingAngle={2}>
                        {statusBreakdown.map((entry) => (
                          <Cell key={entry.status} fill={statusColors[entry.status] ?? "#94A3B8"} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xl font-semibold tabular-nums text-foreground">
                      {statusBreakdown.reduce((s, t) => s + t.count, 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {statusBreakdown.map((s) => (
                    <div key={s.status} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: statusColors[s.status] ?? "#94A3B8" }} />
                        <span className="text-foreground">{s.status}</span>
                      </span>
                      <span className="tabular-nums text-muted-foreground">{s.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            <Button variant="ghost" size="sm" className="mt-4 w-full text-xs" onClick={() => navigate("/admin/transactions")}>
              View All Transactions →
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground">Payment Network</h3>
            <div className="mt-3 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Provider</TableHead>
                    <TableHead className="text-xs">Health</TableHead>
                    <TableHead className="text-xs">Success</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(providersQuery.data ?? []).map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-xs font-medium text-foreground">
                        <ProviderBadge provider={p.code} label={p.short_name ?? p.name} />
                      </TableCell>
                      <TableCell className="text-xs">
                        <StatusBadge status={p.health_status ?? "unknown"} />
                      </TableCell>
                      <TableCell className="text-xs tabular-nums text-muted-foreground">
                        {p.success_rate !== null ? `${p.success_rate}%` : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
        <div className="lg:col-span-3">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground">Businesses by Type</h3>
            {businessesByCategory.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No businesses yet.</p>
            ) : (
              <>
                <div className="relative mx-auto mt-2 h-44 w-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={businessesByCategory} dataKey="count" nameKey="category" innerRadius={52} outerRadius={72} paddingAngle={2}>
                        {businessesByCategory.map((entry, i) => (
                          <Cell key={entry.category} fill={categoryColors[i % categoryColors.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xl font-semibold tabular-nums text-foreground">
                      {businessesByCategory.reduce((s, c) => s + c.count, 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5">
                  {businessesByCategory.map((c, i) => (
                    <div key={c.category} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: categoryColors[i % categoryColors.length] }} />
                        <span className="text-foreground">{c.category}</span>
                      </span>
                      <span className="tabular-nums text-muted-foreground">{c.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            <Button variant="ghost" size="sm" className="mt-3 w-full text-xs" onClick={() => navigate("/admin/businesses")}>
              View All Businesses →
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <ChartCard title="Users by Status" description="Most recent 100 users.">
            {userStatusBreakdown.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No users yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={userStatusBreakdown} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(214 20% 90%)" />
                  <XAxis dataKey="status" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(215 15% 45%)" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(215 15% 45%)" }} width={40} />
                  <Tooltip content={<ChartTooltip formatter={(v) => v.toLocaleString()} />} />
                  <Bar dataKey="count" name="Users" fill="#0B3D2E" radius={[3, 3, 0, 0]} barSize={28} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        <div className="lg:col-span-3">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Open Risk Alerts</h3>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/admin/compliance/fraud-risk")}>
                View All →
              </Button>
            </div>
            <div className="mt-3 divide-y divide-border/60">
              {(riskAlertsQuery.data?.items ?? []).length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">No open alerts.</p>
              )}
              {(riskAlertsQuery.data?.items ?? []).map((r) => (
                <div key={r.id} className="flex items-start justify-between gap-2 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{r.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{r.business_name ?? "—"}</p>
                  </div>
                  <StatusBadge status={r.level} withDot={false} className="shrink-0 text-[10px]" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <CardHeader className="p-0">
            <CardTitle className="text-sm">Cash Flow</CardTitle>
          </CardHeader>
          <CardContent className="mt-3 grid grid-cols-3 gap-4 p-0">
            <div className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">Total Income</p>
              <p className="mt-1 text-sm font-semibold text-foreground">Rs. {stats ? formatCompact(stats.total_income) : "—"}</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">Total Expense</p>
              <p className="mt-1 text-sm font-semibold text-foreground">Rs. {stats ? formatCompact(stats.total_expense) : "—"}</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">Open Support Tickets</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{stats ? stats.open_support_tickets : "—"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="p-5">
          <CardHeader className="p-0">
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="mt-3 grid grid-cols-2 gap-3 p-0">
            <Button variant="outline" className="h-auto flex-col gap-1.5 py-3" onClick={() => navigate("/admin/users")}>
              <Users className="h-4 w-4" />
              <span className="text-xs">View Users</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-1.5 py-3" onClick={() => navigate("/admin/businesses")}>
              <Building2 className="h-4 w-4" />
              <span className="text-xs">View Businesses</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-1.5 py-3" onClick={() => navigate("/admin/transactions")}>
              <ArrowLeftRight className="h-4 w-4" />
              <span className="text-xs">View Transactions</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-1.5 border-[#C5161D]/30 py-3 text-[#C5161D] hover:text-[#C5161D]"
              onClick={() => navigate("/admin/compliance/fraud-risk")}
            >
              <ShieldAlert className="h-4 w-4" />
              <span className="text-xs">Risk Alerts</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
