import { Construction } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card } from "@/components/ui/card";

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <AdminPageHeader title={title} subtitle="Not built yet." />
      <Card className="flex flex-col items-center gap-3 p-12 text-center">
        <Construction className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          This section doesn't have a backend API yet, so there's nothing real to show here.
        </p>
      </Card>
    </div>
  );
}
