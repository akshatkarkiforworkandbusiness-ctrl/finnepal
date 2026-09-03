import { NavigatorScreenParams } from "@react-navigation/native";

import { ProviderId } from "@/types";

export type MainTabParamList = {
  Home: undefined;
  Transactions: { initialFilter?: "all" | "income" | "expense" | "pending" } | undefined;
  Insights: undefined;
  FinancialProfile: undefined;
  More: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Welcome: undefined;
  BusinessType: undefined;
  BusinessSetup: undefined;
  ConnectAccounts: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;

  TransactionDetail: { transactionId: string };
  AddTransaction: { initialType?: "income" | "expense"; editId?: string } | undefined;
  Reconciliation: undefined;
  ReconciliationDetail: { transactionId: string };

  SalesAnalytics: undefined;
  ExpenseAnalytics: undefined;
  CashFlow: undefined;

  TallyIntegration: undefined;
  TallySyncStatus: undefined;
  TallyXMLPreview: undefined;
  TallyReconciliation: undefined;
  ShareConsent: undefined;
  Financing: undefined;

  ProviderAuth: { providerId: ProviderId };
  ConnectionSuccess: { providerId: ProviderId };
  ManageConnection: { providerId: ProviderId };
  BankConnections: undefined;

  SecurityPrivacy: undefined;
  FraudAlert: undefined;
  SecurityArchitecture: undefined;
  ActivityLog: undefined;

  Profile: undefined;
  ProfileEdit: undefined;
  Notifications: undefined;
  HelpCenter: undefined;
  Terms: undefined;
  About: undefined;

  DemoStates: undefined;
  StateDemo: { kind: "empty" | "error" | "sync" };

  AIAssistant: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
