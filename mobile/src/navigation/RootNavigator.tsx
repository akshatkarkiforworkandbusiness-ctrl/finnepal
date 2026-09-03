import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { BankConnectionsScreen } from "@/screens/Connections/BankConnectionsScreen";
import { ConnectionSuccessScreen } from "@/screens/Connections/ConnectionSuccessScreen";
import { ManageConnectionScreen } from "@/screens/Connections/ManageConnectionScreen";
import { ProviderAuthScreen } from "@/screens/Connections/ProviderAuthScreen";
import { DemoStatesScreen } from "@/screens/Demo/DemoStatesScreen";
import { StateDemoScreen } from "@/screens/Demo/StateDemoScreen";
import { ActivityLogScreen } from "@/screens/Security/ActivityLogScreen";
import { FraudAlertScreen } from "@/screens/Security/FraudAlertScreen";
import { SecurityArchitectureScreen } from "@/screens/Security/SecurityArchitectureScreen";
import { SecurityPrivacyScreen } from "@/screens/Security/SecurityPrivacyScreen";
import { CashFlowScreen } from "@/screens/Insights/CashFlowScreen";
import { ExpenseAnalyticsScreen } from "@/screens/Insights/ExpenseAnalyticsScreen";
import { SalesAnalyticsScreen } from "@/screens/Insights/SalesAnalyticsScreen";
import { AddTransactionScreen } from "@/screens/Money/AddTransactionScreen";
import { ReconciliationDetailScreen } from "@/screens/Money/ReconciliationDetailScreen";
import { ReconciliationScreen } from "@/screens/Money/ReconciliationScreen";
import { TransactionDetailScreen } from "@/screens/Money/TransactionDetailScreen";
import { BusinessSetupScreen } from "@/screens/Onboarding/BusinessSetupScreen";
import { BusinessTypeScreen } from "@/screens/Onboarding/BusinessTypeScreen";
import { ConnectAccountsScreen } from "@/screens/Onboarding/ConnectAccountsScreen";
import { WelcomeScreen } from "@/screens/Onboarding/WelcomeScreen";
import { FinancingScreen } from "@/screens/Opportunities/FinancingScreen";
import { FinancialProfileScreen } from "@/screens/FinancialProfile/FinancialProfileScreen";
import { ShareConsentScreen } from "@/screens/FinancialProfile/ShareConsentScreen";
import { TallyIntegrationScreen } from "@/screens/FinancialProfile/TallyIntegrationScreen";
import { TallyReconciliationScreen } from "@/screens/FinancialProfile/TallyReconciliationScreen";
import { TallySyncStatusScreen } from "@/screens/FinancialProfile/TallySyncStatusScreen";
import { TallyXMLPreviewScreen } from "@/screens/FinancialProfile/TallyXMLPreviewScreen";
import { AboutScreen } from "@/screens/Settings/AboutScreen";
import { HelpCenterScreen } from "@/screens/Settings/HelpCenterScreen";
import { NotificationsScreen } from "@/screens/Settings/NotificationsScreen";
import { ProfileEditScreen } from "@/screens/Settings/ProfileEditScreen";
import { ProfileScreen } from "@/screens/Settings/ProfileScreen";
import { TermsScreen } from "@/screens/Settings/TermsScreen";
import { SplashScreen } from "@/screens/Splash/SplashScreen";
import { LoginScreen } from "@/screens/Auth/LoginScreen";
import { AIAssistantScreen } from "@/screens/AI/AIAssistantScreen";

import { MainTabNavigator } from "./MainTabNavigator";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="BusinessType" component={BusinessTypeScreen} />
      <Stack.Screen name="BusinessSetup" component={BusinessSetupScreen} />
      <Stack.Screen name="ConnectAccounts" component={ConnectAccountsScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />

      <Stack.Screen name="AIAssistant" component={AIAssistantScreen} options={{ animation: "slide_from_bottom" }} />

      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="Reconciliation" component={ReconciliationScreen} />
      <Stack.Screen name="ReconciliationDetail" component={ReconciliationDetailScreen} />

      <Stack.Screen name="SalesAnalytics" component={SalesAnalyticsScreen} />
      <Stack.Screen name="ExpenseAnalytics" component={ExpenseAnalyticsScreen} />
      <Stack.Screen name="CashFlow" component={CashFlowScreen} />

      <Stack.Screen name="TallyIntegration" component={TallyIntegrationScreen} />
      <Stack.Screen name="TallySyncStatus" component={TallySyncStatusScreen} />
      <Stack.Screen name="TallyXMLPreview" component={TallyXMLPreviewScreen} />
      <Stack.Screen name="TallyReconciliation" component={TallyReconciliationScreen} />
      <Stack.Screen name="ShareConsent" component={ShareConsentScreen} options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="Financing" component={FinancingScreen} />

      <Stack.Screen name="ProviderAuth" component={ProviderAuthScreen} options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="ConnectionSuccess" component={ConnectionSuccessScreen} options={{ animation: "fade" }} />
      <Stack.Screen name="ManageConnection" component={ManageConnectionScreen} />
      <Stack.Screen name="BankConnections" component={BankConnectionsScreen} />

      <Stack.Screen name="SecurityPrivacy" component={SecurityPrivacyScreen} />
      <Stack.Screen name="FraudAlert" component={FraudAlertScreen} options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="SecurityArchitecture" component={SecurityArchitectureScreen} />
      <Stack.Screen name="ActivityLog" component={ActivityLogScreen} />

      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />

      <Stack.Screen name="DemoStates" component={DemoStatesScreen} />
      <Stack.Screen name="StateDemo" component={StateDemoScreen} />
    </Stack.Navigator>
  );
}
