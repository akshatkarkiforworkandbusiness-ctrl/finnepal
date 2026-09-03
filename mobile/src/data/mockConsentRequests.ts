import { ConsentRequest } from "@/types";

export const CONSENT_REQUESTS: ConsentRequest[] = [
  {
    id: "cr1",
    requesterName: "Nabil Bank Ltd.",
    purpose: "Business financing assessment",
    dataItems: [
      { id: "sales", label: "Sales History — 12 months", selected: true },
      { id: "expenses", label: "Expense History — 12 months", selected: true },
      { id: "cashflow", label: "Cash Flow History", selected: true },
      { id: "reconciled", label: "Reconciled Transactions", selected: true },
      { id: "customers", label: "Customer Details", selected: false },
    ],
    durationDays: 30,
  },
];
