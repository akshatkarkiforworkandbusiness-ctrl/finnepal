import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp, ArrowDownCircle, Scale } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { ChartTooltip } from "@/components/admin/ChartTooltip";
import { cashFlowData, cashFlowStats } from "@/mock/cashflow";

function formatNpr(value: number) {
  if (value >= 1_000_000_000) return `NPR ${(value / 1_000_000_000).toFixed(2)}B`;
  return `NPR ${(value / 1_000_000).toFixed(1)}M`;
}

export default function CashFlowPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Cash Flow" subtitle="Platform-level income vs. expense activity across all businesses." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Income" value={formatNpr(cashFlowStats.totalIncome)} icon={TrendingUp} />
        <StatCard label="Total Expenses" value={formatNpr(cashFlowStats.totalExpense)} icon={ArrowDownCircle} />
        <StatCard label="Net Cash Flow" value={formatNpr(cashFlowStats.netCashFlow)} icon={Scale} />
      </div>

      <ChartCard title="Income vs. Expense" description="Monthly totals across the Orbit business network, in NPR Crore.">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={cashFlowData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="income-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0B3D2E" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#0B3D2E" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expense-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94A3B8" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#94A3B8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(214 20% 90%)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(215 15% 45%)" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(215 15% 45%)" }} width={44} />
            <Tooltip content={<ChartTooltip formatter={(v) => `NPR ${v}Cr`} />} />
            <Area type="monotone" dataKey="income" name="Income" stroke="#0B3D2E" strokeWidth={2} fill="url(#income-grad)" />
            <Area type="monotone" dataKey="expense" name="Expense" stroke="#94A3B8" strokeWidth={2} fill="url(#expense-grad)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
