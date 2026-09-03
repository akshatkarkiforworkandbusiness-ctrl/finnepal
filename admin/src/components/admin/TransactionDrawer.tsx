import type { Transaction } from "@/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "./StatusBadge";
import { AuditTimeline } from "./AuditTimeline";
import { auditEvents } from "@/mock/audit";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

export function TransactionDrawer({
  transaction,
  open,
  onOpenChange,
}: {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {transaction && (
          <>
            <SheetHeader>
              <SheetTitle className="tabular-nums">{transaction.id}</SheetTitle>
              <SheetDescription>Transaction detail — mock/sandbox data.</SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                  {transaction.type === "Expense" ? "-" : "+"}NPR {transaction.amount.toLocaleString()}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={transaction.status} />
                  <StatusBadge status={transaction.reconciliation} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Type" value={transaction.type} />
                <Field label="Source" value={transaction.source} />
                <Field label="Business" value={transaction.business} />
                <Field label="Category" value={transaction.category} />
                <Field label="Channel" value={transaction.channel} />
                <Field label="Date" value={transaction.date} />
                <Field label="Reference" value={transaction.reference} />
                <Field label="Reconciliation" value={transaction.reconciliation} />
              </div>

              <Separator />

              <div>
                <p className="mb-2 text-sm font-semibold text-foreground">Audit events</p>
                <AuditTimeline events={auditEvents.slice(0, 3)} />
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
