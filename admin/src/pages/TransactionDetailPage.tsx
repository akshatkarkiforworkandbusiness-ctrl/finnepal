import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CircleDot } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getTransactionById } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const timeline = [
  { label: "Created", desc: "Transaction initiated at source." },
  { label: "Received", desc: "Received via provider adapter." },
  { label: "Normalized", desc: "Mapped to Orbit's canonical schema." },
  { label: "Categorized", desc: "Auto-categorized by rules engine." },
  { label: "Displayed", desc: "Available in business ledger." },
];

export default function TransactionDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const t = getTransactionById(id);

  const rows = [
    { label: "Transaction ID", value: t.id, mono: true },
    { label: "Amount", value: `Rs. ${formatCurrency(t.amount)}` },
    { label: "Type", value: t.type === "Refund" ? "Expense" : "Income" },
    { label: "Provider", value: t.provider },
    { label: "Date", value: t.date },
    { label: "Reference", value: t.reference, mono: true },
    { label: "Source", value: `${t.source} / Demo Adapter` },
  ];

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={() => navigate("/admin/transactions")}>
        <ArrowLeft className="h-4 w-4" /> Back to transactions
      </Button>

      <AdminPageHeader
        title={t.id}
        subtitle={<span>{t.business}</span> as unknown as string}
        actions={<StatusBadge status={t.status} className="h-7 px-3" />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Transaction details</CardTitle></CardHeader>
          <CardContent className="divide-y">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between py-3 text-sm">
                <span className="text-muted-foreground">{r.label}</span>
                <span className={r.mono ? "font-mono font-medium" : "font-medium"}>{r.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-muted-foreground">Business</span>
              <Link to={`/admin/businesses/${t.businessId}`} className="font-medium text-primary hover:underline">{t.business}</Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Audit timeline</CardTitle></CardHeader>
          <CardContent>
            <ol className="relative space-y-5 pl-6">
              <span className="absolute left-[7px] top-1 h-[calc(100%-1rem)] w-px bg-border" />
              {timeline.map((step) => (
                <li key={step.label} className="relative">
                  <CircleDot className="absolute -left-6 top-0 h-3.5 w-3.5 text-primary" />
                  <p className="text-sm font-medium text-foreground">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <Separator />
      <p className="text-xs text-muted-foreground">Credentials are never exposed. Only normalized transaction metadata is stored and shown.</p>
    </div>
  );
}
