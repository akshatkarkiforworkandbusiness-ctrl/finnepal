import { FinancingOption } from "@/types";

/** Mock only — informational categories, never an approval, offer, or eligibility claim. */
export const FINANCING_OPTIONS: FinancingOption[] = [
  { id: "f1", title: "Working Capital", maxAmount: 100000, note: "Category based on typical business financing products" },
  { id: "f2", title: "Equipment Financing", maxAmount: 150000, note: "Category based on typical business financing products" },
  { id: "f3", title: "Inventory Financing", maxAmount: 80000, note: "Category based on typical business financing products" },
];
