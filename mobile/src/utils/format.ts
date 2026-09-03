export function formatNPR(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString("en-IN")}`;
}

export function formatSignedNPR(amount: number, type: "income" | "expense"): string {
  const sign = type === "income" ? "+" : "-";
  return `${sign}${formatNPR(Math.abs(amount))}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function formatRelativeDay(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) / 86400000);
  if (diffDays === 0) return `Today, ${formatTime(iso)}`;
  if (diffDays === 1) return `Yesterday, ${formatTime(iso)}`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(iso);
}
