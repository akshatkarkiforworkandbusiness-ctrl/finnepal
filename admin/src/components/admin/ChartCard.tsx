import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface ChartCardProps {
  title: string;
  description?: string;
  controls?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

export function ChartCard({ title, description, controls, footer, children }: ChartCardProps) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {controls}
      </div>
      <div className="mt-4">{children}</div>
      {footer && <div className="mt-4 border-t pt-4">{footer}</div>}
    </Card>
  );
}
