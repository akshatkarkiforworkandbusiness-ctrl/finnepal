import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

const labelMap: Record<string, string> = {
  admin: "Admin",
  login: "Login",
  dashboard: "Dashboard",
  users: "Users",
  businesses: "Businesses",
  transactions: "Transactions",
  payments: "Payments",
  reconciliation: "Reconciliation",
  "cash-flow": "Cash Flow",
  analytics: "Analytics",
  credit: "Credit",
  insurance: "Insurance",
  savings: "Savings",
  integrations: "Integrations",
  banks: "Banks",
  wallets: "Wallets",
  tally: "Tally",
  logs: "Sync Logs",
  api: "API / Sandbox",
  compliance: "Compliance",
  kyc: "KYC",
  consent: "Consent & Data Access",
  "audit-logs": "Audit Logs",
  "fraud-risk": "Fraud & Risk",
  security: "Security Center",
  notifications: "Notifications",
  settings: "Settings",
  "admin-users": "Admin Users",
};

export function AdminBreadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean); // e.g. ["admin","users","USR-1001"]

  const crumbs = parts.map((part, idx) => {
    const href = "/" + parts.slice(0, idx + 1).join("/");
    const isId = idx > 1 && !labelMap[part];
    const label = isId ? part : labelMap[part] ?? part;
    return { href, label, isLast: idx === parts.length - 1 };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {crumbs.map((c) => (
        <Fragment key={c.href}>
          {c.isLast ? (
            <span className="font-medium text-foreground">{c.label}</span>
          ) : (
            <>
              <Link to={c.href} className="text-muted-foreground transition-colors hover:text-foreground">
                {c.label}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            </>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
