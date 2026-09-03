import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import type { ChartPoint } from "@/mock/transactions";

interface MetricChartProps {
  data: ChartPoint[];
  dataKey: keyof Omit<ChartPoint, "label">;
  formatter?: (v: number) => string;
  color?: string;
}

export function MetricChart({ data, dataKey, formatter, color = "#0B3D2E" }: MetricChartProps) {
  return (
    <ResponsiveContainer width="100%" height={288}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.18} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(214 20% 90%)" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(215 15% 45%)" }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "hsl(215 15% 45%)" }} width={48} />
        <Tooltip content={<ChartTooltip formatter={formatter} />} cursor={{ stroke: color, strokeOpacity: 0.2 }} />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#grad-${dataKey})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
