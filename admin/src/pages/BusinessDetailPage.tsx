import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { MetricChart } from "@/components/admin/MetricChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { getBusinessById, providerHealth, transactionChartData, transactions } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function BusinessDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const b = getBusinessById(id);
  const net = b.monthlySales - b.monthlyExpenses;
  const bizTx = transactions.filter((t) => t.businessId === b.id).slice(0, 6);

  const financials = [
    { label: "Monthly sales", value: `Rs. ${formatCurrency(b.monthlySales)}`, tone: "text-emerald-600" },
    { label: "Monthly expenses", value: `Rs. ${formatCurrency(b.monthlyExpenses)}`, tone: "text-foreground" },
    { label: "Net cash flow", value: `Rs. ${formatCurrency(net)}`, tone: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={() => navigate("/admin/businesses")}>
        <ArrowLeft className="h-4 w-4" /> Back to businesses
      </Button>

      <AdminPageHeader
        title={b.name}
        subtitle={`Owner: ${b.owner}`}
        actions={<StatusBadge status={b.status} className="h-7 px-3" />}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Business profile</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{b.type}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="font-medium">{b.location}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Activity</span><span className="font-medium">{b.activity}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span className="font-medium">{b.created}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Owner</span>
              <Link to={`/admin/users/${b.ownerId}`} className="font-medium text-primary hover:underline">{b.owner}</Link>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Financial activity summary</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {financials.map((f) => (
                <div key={f.label} className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                  <p className={`mt-1 text-xl font-semibold tabular-nums ${f.tone}`}>{f.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">These values are mock data for the prototype.</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader><CardTitle>Activity trend</CardTitle></CardHeader>
            <CardContent><MetricChart data={transactionChartData} dataKey="transactions" /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardContent className="divide-y p-0">
              {bizTx.map((t) => (
                <Link key={t.id} to={`/admin/transactions/${t.id}`} className="flex items-center justify-between p-4 hover:bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{t.id}</p>
                    <p className="text-xs text-muted-foreground">{t.provider} · {t.type} · {t.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold tabular-nums">Rs. {formatCurrency(t.amount)}</span>
                    <StatusBadge status={t.status} />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections">
          <Card>
            <CardContent className="divide-y p-0">
              {providerHealth.slice(0, b.providers).map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4">
                  <div><p className="text-sm font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{p.category}</p></div>
                  <StatusBadge status="Connected" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card><CardContent className="p-6 text-sm text-muted-foreground">Owner {b.owner} is the only team member.</CardContent></Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card><CardContent className="p-6 text-sm text-muted-foreground">No configuration changes recorded for this business.</CardContent></Card>
        </TabsContent>
      </Tabs>

      <Separator />
      <p className="text-xs text-muted-foreground">Admins view operational metadata only — never credentials, MPIN, OTP, or API secrets.</p>
    </div>
  );
}
