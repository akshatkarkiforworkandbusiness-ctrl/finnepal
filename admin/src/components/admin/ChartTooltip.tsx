interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
  formatter?: (v: number) => string;
}

export function ChartTooltip({ active, payload, label, formatter }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 shadow-md">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-sm">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="capitalize text-muted-foreground">{p.name}</span>
          <span className="ml-auto font-semibold tabular-nums text-foreground">
            {formatter ? formatter(p.value) : p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
