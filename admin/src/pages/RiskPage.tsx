import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { RiskBadge } from "@/components/admin/RiskBadge";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { riskAlerts } from "@/lib/mock-data";
import { toast } from "@/components/ui/sonner";

export default function RiskPage() {
  const [tab, setTab] = useState("all");
  const filtered = riskAlerts.filter((a) => tab === "all" || a.level.toLowerCase() === tab);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Risk Alerts"
        subtitle="Investigate anomalies and compliance signals across the platform."
        actions={
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="high">High</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="low">Low</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      <div className="space-y-3">
        {filtered.map((a) => (
          <Card key={a.id}>
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <RiskBadge level={a.level} />
                <div>
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <p className="text-sm text-muted-foreground">{a.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{a.business} · {a.id} · {a.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <StatusBadge status={a.status} />
                <Button variant="outline" size="sm" onClick={() => toast.success(`${a.id} marked as investigating`)}>
                  Investigate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
