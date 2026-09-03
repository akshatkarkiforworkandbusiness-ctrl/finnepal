import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Wallet, TrendingUp, ArrowDownCircle, Receipt, Building2, LineChart } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { ChartTooltip } from "@/components/admin/ChartTooltip";
import { analyticsCards, businessGrowth, monthlyTransactionValue, paymentChannelDistribution } from "@/mock/analytics";

const channelColors = ["#0B3D2E", "#3D8B68", "#A8CCB8"];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Analytics"
        subtitle="Descriptive platform-level metrics. Orbit does not compute or display a financial health score."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Transaction Value" value={analyticsCards.totalTransactionValue} icon={Wallet} />
        <StatCard label="Total Income" value={analyticsCards.totalIncome} icon={TrendingUp} />
        <StatCard label="Total Expenses" value={analyticsCards.totalExpenses} icon={ArrowDownCircle} />
        <StatCard label="Average Transaction" value={analyticsCards.averageTransaction} icon={Receipt} />
        <StatCard label="Active Businesses" value={analyticsCards.activeBusinesses} icon={Building2} />
        <StatCard label="Revenue Growth" value={analyticsCards.revenueGrowth} icon={LineChart} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Monthly Transaction Value" description="Total processed value, in NPR Crore.">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyTransactionValue} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="mtv-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B3D2E" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#0B3D2E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(214 20% 90%)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(215 15% 45%)" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(215 15% 45%)" }} width={44} />
              <Tooltip content={<ChartTooltip formatter={(v) => `NPR ${v}Cr`} />} />
              <Area type="monotone" dataKey="value" name="Transaction Value" stroke="#0B3D2E" strokeWidth={2} fill="url(#mtv-grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Business Growth" description="Active businesses on the Orbit platform over time.">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={businessGrowth} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(214 20% 90%)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(215 15% 45%)" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(215 15% 45%)" }} width={44} />
              <Tooltip content={<ChartTooltip formatter={(v) => v.toLocaleString()} />} />
              <Bar dataKey="value" name="Active Businesses" fill="#0B3D2E" radius={[3, 3, 0, 0]} barSize={26} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Payment Channel Distribution" description="Share of transaction volume by channel.">
        <div className="space-y-3">
          {paymentChannelDistribution.map((c, i) => (
            <div key={c.channel}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{c.channel}</span>
                <span className="tabular-nums text-muted-foreground">{c.percentage}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${c.percentage}%`, backgroundColor: channelColors[i % channelColors.length] }}
                />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
