import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ranges = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
];

interface DateRangeFilterProps {
  value: string;
  onChange: (v: string) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <div className="inline-flex items-center rounded-md border bg-background p-0.5">
      {ranges.map((r) => (
        <Button
          key={r.key}
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(r.key)}
          className={cn(
            "h-8 rounded-[5px] px-3 text-xs font-medium",
            value === r.key ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : "text-muted-foreground"
          )}
        >
          {r.label}
        </Button>
      ))}
    </div>
  );
}
