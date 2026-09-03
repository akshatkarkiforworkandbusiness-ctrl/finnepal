import { Category } from "@/types";

/**
 * Income categories are product/sales categories (drives "Sales by Category" analytics).
 * Expense categories are business cost categories (drives "Expenses by Category" analytics).
 */
export const INCOME_CATEGORIES: Category[] = [
  { id: "groceries", name: "Groceries", type: "income" },
  { id: "beverages", name: "Beverages", type: "income" },
  { id: "household", name: "Household", type: "income" },
  { id: "personalcare", name: "Personal Care", type: "income" },
  { id: "other-income", name: "Other", type: "income" },
];

export const EXPENSE_CATEGORIES: Category[] = [
  { id: "inventory", name: "Inventory", type: "expense" },
  { id: "rent", name: "Rent", type: "expense" },
  { id: "utilities", name: "Utilities", type: "expense" },
  { id: "staff", name: "Staff", type: "expense" },
  { id: "transport", name: "Transport", type: "expense" },
  { id: "marketing", name: "Marketing", type: "expense" },
  { id: "other-expense", name: "Other", type: "expense" },
];

export const CATEGORIES: Category[] = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export const SOURCE_CHANNELS = ["Cash", "Bank", "eSewa", "Khalti", "Other"] as const;
