import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import LoginPage from "@/pages/auth/LoginPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import UsersPage from "@/pages/UsersPage";
import UserDetailPage from "@/pages/UserDetailPage";
import BusinessesPage from "@/pages/BusinessesPage";
import BusinessDetailPage from "@/pages/BusinessDetailPage";
import TransactionsPage from "@/pages/TransactionsPage";
import TransactionDetailPage from "@/pages/TransactionDetailPage";
import ProvidersPage from "@/pages/ProvidersPage";
import ProviderDetailPage from "@/pages/ProviderDetailPage";
import RiskPage from "@/pages/RiskPage";
import ConsentPage from "@/pages/ConsentPage";
import AuditPage from "@/pages/AuditPage";
import SupportPage from "@/pages/SupportPage";
import SystemPage from "@/pages/SystemPage";
import SettingsPage from "@/pages/SettingsPage";
import AnalyticsPage from "@/pages/analytics/AnalyticsPage";
import CashFlowPage from "@/pages/cashflow/CashFlowPage";
import IntegrationsPage from "@/pages/integrations/IntegrationsPage";
import ComingSoonPage from "@/pages/ComingSoonPage";
import BanksPage from "@/pages/integrations/BanksPage";
import AIUsagePage from "@/pages/AIUsagePage";
import AdminProfilePage from "@/pages/AdminProfilePage";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <TooltipProvider delayDuration={200}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />

              <Route path="users" element={<UsersPage />} />
              <Route path="users/:id" element={<UserDetailPage />} />
              <Route path="businesses" element={<BusinessesPage />} />
              <Route path="businesses/:id" element={<BusinessDetailPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="transactions/:id" element={<TransactionDetailPage />} />
              <Route path="providers" element={<ProvidersPage />} />
              <Route path="providers/:id" element={<ProviderDetailPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="system" element={<SystemPage />} />

              <Route path="payments" element={<ComingSoonPage title="Payments" />} />
              <Route path="reconciliation" element={<ComingSoonPage title="Reconciliation" />} />

              <Route path="cash-flow" element={<CashFlowPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="credit" element={<ComingSoonPage title="Credit" />} />
              <Route path="insurance" element={<ComingSoonPage title="Insurance" />} />
              <Route path="savings" element={<ComingSoonPage title="Savings" />} />

              <Route path="integrations/payments" element={<IntegrationsPage />} />
              <Route path="integrations/banks" element={<BanksPage />} />
              <Route path="integrations/wallets" element={<ComingSoonPage title="Wallets" />} />
              <Route path="integrations/tally" element={<ComingSoonPage title="Tally" />} />
              <Route path="integrations/api" element={<ComingSoonPage title="API / Sandbox" />} />

              <Route path="compliance/kyc" element={<ComingSoonPage title="KYC" />} />
              <Route path="compliance/consent" element={<ConsentPage />} />
              <Route path="compliance/audit-logs" element={<AuditPage />} />
              <Route path="compliance/fraud-risk" element={<RiskPage />} />

              <Route path="notifications" element={<ComingSoonPage title="Notifications" />} />
              <Route path="settings/admin-users" element={<ComingSoonPage title="Admin Users" />} />
              <Route path="settings" element={<SettingsPage />} />

              <Route path="ai-usage" element={<AIUsagePage />} />
              <Route path="profile" element={<AdminProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </TooltipProvider>
  );
}
