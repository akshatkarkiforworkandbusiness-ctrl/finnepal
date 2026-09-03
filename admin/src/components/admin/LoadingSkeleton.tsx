import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function LoadingSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <Card className="divide-y">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-6 w-16 rounded-md" />
        </div>
      ))}
    </Card>
  );
}
