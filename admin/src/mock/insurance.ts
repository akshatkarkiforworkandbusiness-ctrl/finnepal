import type { InsuranceProduct } from "@/types";

export const insuranceProducts: InsuranceProduct[] = [
  { id: "INS-1", name: "Business Property Protection", provider: "Nepal Life Insurance", category: "Property", businessesDiscovered: 3120, businessesEnrolled: 412, status: "Available" },
  { id: "INS-2", name: "Inventory & Stock Cover", provider: "Sagarmatha Insurance", category: "Inventory", businessesDiscovered: 2480, businessesEnrolled: 268, status: "Available" },
  { id: "INS-3", name: "Fire & Theft Cover", provider: "Prabhu Insurance", category: "Property", businessesDiscovered: 1860, businessesEnrolled: 190, status: "Available" },
  { id: "INS-4", name: "Group Health for Employees", provider: "Nepal Life Insurance", category: "Health", businessesDiscovered: 940, businessesEnrolled: 0, status: "Coming Soon" },
];

export const insuranceStats = {
  discovered: insuranceProducts.reduce((s, p) => s + p.businessesDiscovered, 0),
  enrolled: insuranceProducts.reduce((s, p) => s + p.businessesEnrolled, 0),
};
