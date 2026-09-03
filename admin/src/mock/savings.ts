import type { SavingsSummary } from "@/types";
import { businesses } from "./businesses";

const goals = ["Emergency Fund", "Equipment Upgrade", "Inventory Expansion", "Tax Reserve", "Shop Renovation"];

export const savingsSummaries: SavingsSummary[] = businesses.slice(0, 10).map((b, i) => {
  const target = 50000 + i * 15000;
  const saved = Math.round(target * (0.3 + ((i * 17) % 60) / 100));
  return {
    businessId: b.id,
    business: b.name,
    goalName: goals[i % goals.length],
    targetAmount: target,
    savedAmount: saved,
    status: saved >= target ? "Completed" : saved / target > 0.5 ? "On Track" : "Behind",
  };
});

export const savingsStats = {
  totalSaved: savingsSummaries.reduce((s, g) => s + g.savedAmount, 0),
  totalTarget: savingsSummaries.reduce((s, g) => s + g.targetAmount, 0),
  activeGoals: savingsSummaries.length,
};
