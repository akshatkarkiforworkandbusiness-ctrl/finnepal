import { Customer } from "@/types";

export const CUSTOMERS: Customer[] = [
  { id: "c1", name: "Kathmandu Mart" },
  { id: "c2", name: "Sunrise Hotel" },
  { id: "c3", name: "Patan Cafe" },
  { id: "c4", name: "Himal Traders" },
  { id: "c5", name: "Local Walk-in" },
];

export function getCustomer(id?: string): Customer | undefined {
  if (!id) return undefined;
  return CUSTOMERS.find((c) => c.id === id);
}
