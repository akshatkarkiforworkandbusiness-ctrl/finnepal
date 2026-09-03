import { useNavigate } from "react-router-dom";
import { PlugZap, Building, Wallet, FileSpreadsheet, Terminal, ChevronRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card } from "@/components/ui/card";
import { integrationHealth } from "@/mock/payments";
import { tallyStats } from "@/mock/tally";

const healthByName = Object.fromEntries(integrationHealth.map((h) => [h.name, h]));

const hubs = [
  {
    title: "Payment Providers",
    description: "eSewa, Khalti, Bank, and other digital wallet integrations.",
    icon: PlugZap,
    to: "/admin/integrations/payments",
    status: healthByName["Payment APIs"]?.label ?? "—",
  },
  {
    title: "Banks",
    description: "Connected bank account integrations for reconciliation.",
    icon: Building,
    to: "/admin/integrations/banks",
    status: healthByName["Banks"] ? `${healthByName["Banks"].connected}/${healthByName["Banks"].total} Connected` : "—",
  },
  {
    title: "Wallets",
    description: "Digital wallet connections beyond the core payment providers.",
    icon: Wallet,
    to: "/admin/integrations/wallets",
    status: healthByName["Wallets"] ? `${healthByName["Wallets"].connected}/${healthByName["Wallets"].total} Connected` : "—",
  },
  {
    title: "Tally",
    description: "Business accounting sync — ledgers, vouchers, and XML exports.",
    icon: FileSpreadsheet,
    to: "/admin/integrations/tally",
    status: `${tallyStats.connectedBusinesses} businesses connected`,
  },
  {
    title: "API / Sandbox",
    description: "Orbit's mock API surface for transactions, businesses, and consent.",
    icon: Terminal,
    to: "/admin/integrations/api",
    status: "SANDBOX · v1",
  },
];

export default function IntegrationsPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Integrations"
        subtitle="Manage Orbit's connected payment, banking, and accounting integrations."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {hubs.map((hub) => (
          <Card
            key={hub.title}
            className="cursor-pointer p-5 transition-colors hover:border-primary/40"
            onClick={() => navigate(hub.to)}
          >
            <div className="flex items-start justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-primary">
                <hub.icon className="h-5 w-5" />
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">{hub.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{hub.description}</p>
            <p className="mt-3 text-xs font-medium text-primary">{hub.status}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
