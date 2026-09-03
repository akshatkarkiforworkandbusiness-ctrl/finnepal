import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  ArrowLeftRight,
  Wallet,
  GitMerge,
  TrendingUp,
  BarChart3,
  Landmark,
  ShieldCheck,
  PiggyBank,
  PlugZap,
  Building,
  FileSpreadsheet,
  Terminal,
  UserCheck,
  FileCheck2,
  ScrollText,
  ShieldAlert,
  Bell,
  UserCog,
  Settings,
  Bot,
  UserCircle,
  ChevronsRight,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";

const roleLabel: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  OPERATIONS_ADMIN: "Operations Admin",
  SUPPORT_ADMIN: "Support Admin",
  COMPLIANCE_ADMIN: "Compliance Admin",
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "AD";
}

interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  { title: "Overview", items: [{ label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard }] },
  {
    title: "Operations",
    items: [
      { label: "Users", to: "/admin/users", icon: Users },
      { label: "Businesses", to: "/admin/businesses", icon: Building2 },
      { label: "Transactions", to: "/admin/transactions", icon: ArrowLeftRight },
      { label: "Payments", to: "/admin/payments", icon: Wallet },
      { label: "Reconciliation", to: "/admin/reconciliation", icon: GitMerge },
    ],
  },
  {
    title: "Financial",
    items: [
      { label: "Cash Flow", to: "/admin/cash-flow", icon: TrendingUp },
      { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
      { label: "Credit", to: "/admin/credit", icon: Landmark },
      { label: "Insurance", to: "/admin/insurance", icon: ShieldCheck },
      { label: "Savings", to: "/admin/savings", icon: PiggyBank },
    ],
  },
  {
    title: "Integrations",
    items: [
      { label: "Payment Providers", to: "/admin/integrations/payments", icon: PlugZap },
      { label: "Banks", to: "/admin/integrations/banks", icon: Building },
      { label: "Wallets", to: "/admin/integrations/wallets", icon: Wallet },
      { label: "Tally", to: "/admin/integrations/tally", icon: FileSpreadsheet },
      { label: "API / Sandbox", to: "/admin/integrations/api", icon: Terminal },
    ],
  },
  {
    title: "Compliance",
    items: [
      { label: "KYC", to: "/admin/compliance/kyc", icon: UserCheck },
      { label: "Consent & Data Access", to: "/admin/compliance/consent", icon: FileCheck2 },
      { label: "Audit Logs", to: "/admin/compliance/audit-logs", icon: ScrollText },
      { label: "Fraud & Risk", to: "/admin/compliance/fraud-risk", icon: ShieldAlert },
    ],
  },
  {
    title: "System",
    items: [
      { label: "AI Usage", to: "/admin/ai-usage", icon: Bot },
      { label: "Notifications", to: "/admin/notifications", icon: Bell },
      { label: "Admin Users", to: "/admin/settings/admin-users", icon: UserCog },
      { label: "Settings", to: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast("Signed out");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white">
          <ChevronsRight className="h-5 w-5 text-primary" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">ORBIT</p>
          <p className="text-[11px] text-sidebar-foreground/70">Fintech Operations</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {sections.map((section, i) => (
          <div key={i}>
            {section.title && (
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-white"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-white"
                    )
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-40" />
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Profile */}
      <div className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-sidebar-accent/60">
            <Avatar className="h-9 w-9">
              <AvatarImage src={admin?.photo_url ?? undefined} alt={admin?.name ?? "Admin"} />
              <AvatarFallback className="bg-white/10 text-xs font-semibold text-white">
                {admin ? initials(admin.name) : "AD"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{admin?.name ?? "Orbit Admin"}</p>
              <p className="truncate text-xs text-sidebar-foreground/70">
                {admin ? roleLabel[admin.role] ?? admin.role : "Administrator"}
              </p>
            </div>
            <MoreVertical className="h-4 w-4 text-sidebar-foreground/70" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <DropdownMenuLabel>{admin?.email ?? "Orbit Admin"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/admin/profile")}>
              <UserCircle className="h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-[#C5161D] focus:text-[#C5161D]"
              onClick={handleLogout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
