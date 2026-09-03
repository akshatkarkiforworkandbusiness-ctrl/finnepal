import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { ACTIVITY_LOG, NOTIFICATION_SETTINGS } from "@/data/mockActivityLogs";
import { BUSINESS, USER } from "@/data/mockBusiness";
import { DEFAULT_CONNECTED_PROVIDER_IDS } from "@/data/mockAccounts";
import { TRANSACTIONS } from "@/data/mockTransactions";
import { connect as connectAccount } from "@/services/integrationService";
import { runSync as runTallySyncFlow } from "@/services/tallyService";
import { ActivityLogEntry, Business, Connection, ProviderId, Transaction, UserProfile } from "@/types";
import { FinanceSummary, forDay, summarize } from "@/utils/finance";

const STORAGE_KEY = "orbit.app.state.v2";

function seedConnections(): Connection[] {
  return DEFAULT_CONNECTED_PROVIDER_IDS.map((id) => ({
    provider: id as ProviderId,
    status: "connected",
    permissions: ["Transactions", "Balance"],
    lastSynced: "Just now",
    connectedAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
  }));
}

interface PersistedState {
  businessSetupComplete: boolean;
  accountsConnected: boolean;
  business: Business;
  profile: UserProfile;
  connections: Connection[];
  transactions: Transaction[];
  notificationSettings: { id: string; label: string; enabled: boolean }[];
  consentGrants: Record<string, { granted: boolean; grantedAt: string; durationDays: number }>;
  activityLog: ActivityLogEntry[];
}

interface AppState extends PersistedState {
  loading: boolean;
  summary: FinanceSummary;
  todaySummary: FinanceSummary;
  updateBusiness: (b: Partial<Business>) => void;
  completeBusinessSetup: () => void;
  completeAccountsConnected: () => void;
  updateProfile: (p: Partial<UserProfile>) => void;
  connectProvider: (id: ProviderId) => Promise<void>;
  disconnectProvider: (id: ProviderId) => void;
  addTransaction: (t: Omit<Transaction, "id" | "businessId" | "currency" | "status" | "verified" | "reference" | "reconciliationStatus" | "tallyStatus">) => void;
  updateTransaction: (
    id: string,
    t: Omit<Transaction, "id" | "businessId" | "currency" | "status" | "verified" | "reference" | "reconciliationStatus" | "tallyStatus" | "tallyAmount">
  ) => void;
  markReconciled: (transactionId: string) => void;
  runTallySync: () => Promise<void>;
  grantConsent: (requestId: string, durationDays: number) => void;
  declineConsent: (requestId: string) => void;
  toggleNotification: (id: string) => void;
  logActivity: (label: string) => void;
  logOut: () => void;
  resetApp: () => void;
}

const AppContext = createContext<AppState | null>(null);

const defaultPersisted: PersistedState = {
  businessSetupComplete: false,
  accountsConnected: false,
  business: BUSINESS,
  profile: USER,
  connections: seedConnections(),
  transactions: TRANSACTIONS,
  notificationSettings: NOTIFICATION_SETTINGS,
  consentGrants: {},
  activityLog: ACTIVITY_LOG,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(defaultPersisted);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setState((prev) => ({ ...prev, ...JSON.parse(raw) }));
      })
      .finally(() => setLoading(false));
  }, []);

  const persist = useCallback((next: PersistedState) => {
    setState(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const logActivity = useCallback(
    (label: string) => {
      const entry: ActivityLogEntry = { id: `log-${Date.now()}`, label, time: "Just now" };
      persist({ ...state, activityLog: [entry, ...state.activityLog] });
    },
    [state, persist]
  );

  const updateBusiness = useCallback((b: Partial<Business>) => persist({ ...state, business: { ...state.business, ...b } }), [state, persist]);
  const completeBusinessSetup = useCallback(() => persist({ ...state, businessSetupComplete: true }), [state, persist]);
  const completeAccountsConnected = useCallback(() => persist({ ...state, accountsConnected: true }), [state, persist]);
  const updateProfile = useCallback((p: Partial<UserProfile>) => persist({ ...state, profile: { ...state.profile, ...p } }), [state, persist]);

  const connectProvider = useCallback(
    async (id: ProviderId) => {
      await connectAccount(id, { name: state.business.name, type: state.business.type, location: state.business.location });
      const record: Connection = {
        provider: id,
        status: "connected",
        permissions: ["Transactions", "Balance"],
        lastSynced: "Just now",
        connectedAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      };
      const nextConnections = state.connections.some((c) => c.provider === id)
        ? state.connections.map((c) => (c.provider === id ? record : c))
        : [...state.connections, record];
      const entry: ActivityLogEntry = { id: `log-${Date.now()}`, label: `${id} connection updated`, time: "Just now" };
      persist({ ...state, connections: nextConnections, activityLog: [entry, ...state.activityLog] });
    },
    [state, persist]
  );

  const disconnectProvider = useCallback(
    (id: ProviderId) => {
      persist({ ...state, connections: state.connections.filter((c) => c.provider !== id) });
    },
    [state, persist]
  );

  const addTransaction = useCallback(
    (t: Omit<Transaction, "id" | "businessId" | "currency" | "status" | "verified" | "reference" | "reconciliationStatus" | "tallyStatus">) => {
      const record: Transaction = {
        ...t,
        id: `manual-${Date.now()}`,
        businessId: state.business.id,
        currency: "NPR",
        status: "completed",
        verified: true,
        reference: `ORB-MANUAL-${Date.now().toString().slice(-6)}`,
        reconciliationStatus: "pending",
        tallyStatus: "pending",
      };
      persist({ ...state, transactions: [record, ...state.transactions] });
    },
    [state, persist]
  );

  const updateTransaction = useCallback(
    (
      id: string,
      t: Omit<Transaction, "id" | "businessId" | "currency" | "status" | "verified" | "reference" | "reconciliationStatus" | "tallyStatus" | "tallyAmount">
    ) => {
      persist({
        ...state,
        transactions: state.transactions.map((existing) =>
          existing.id === id
            ? { ...existing, ...t, reconciliationStatus: "pending", tallyStatus: "pending", tallyAmount: undefined }
            : existing
        ),
      });
    },
    [state, persist]
  );

  const markReconciled = useCallback(
    (transactionId: string) => {
      persist({
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === transactionId ? { ...t, reconciliationStatus: "matched", tallyAmount: t.amount } : t
        ),
      });
    },
    [state, persist]
  );

  const runTallySync = useCallback(async () => {
    await runTallySyncFlow();
    const entry: ActivityLogEntry = { id: `log-${Date.now()}`, label: "Tally sync completed", time: "Just now" };
    persist({ ...state, activityLog: [entry, ...state.activityLog] });
  }, [state, persist]);

  const grantConsent = useCallback(
    (requestId: string, durationDays: number) => {
      const entry: ActivityLogEntry = { id: `log-${Date.now()}`, label: "Financial profile shared", time: "Just now" };
      persist({
        ...state,
        consentGrants: { ...state.consentGrants, [requestId]: { granted: true, grantedAt: new Date().toISOString(), durationDays } },
        activityLog: [entry, ...state.activityLog],
      });
    },
    [state, persist]
  );

  const declineConsent = useCallback(
    (requestId: string) => {
      persist({
        ...state,
        consentGrants: { ...state.consentGrants, [requestId]: { granted: false, grantedAt: new Date().toISOString(), durationDays: 0 } },
      });
    },
    [state, persist]
  );

  const toggleNotification = useCallback(
    (id: string) => {
      persist({ ...state, notificationSettings: state.notificationSettings.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)) });
    },
    [state, persist]
  );

  const logOut = useCallback(() => {
    persist({ ...defaultPersisted, businessSetupComplete: true, accountsConnected: true });
  }, [persist]);

  const resetApp = useCallback(() => {
    persist(defaultPersisted);
  }, [persist]);

  const summary = useMemo(() => summarize(state.transactions), [state.transactions]);
  const todaySummary = useMemo(() => summarize(forDay(state.transactions)), [state.transactions]);

  const value = useMemo<AppState>(
    () => ({
      ...state,
      loading,
      summary,
      todaySummary,
      updateBusiness,
      completeBusinessSetup,
      completeAccountsConnected,
      updateProfile,
      connectProvider,
      disconnectProvider,
      addTransaction,
      updateTransaction,
      markReconciled,
      runTallySync,
      grantConsent,
      declineConsent,
      toggleNotification,
      logActivity,
      logOut,
      resetApp,
    }),
    [
      state,
      loading,
      summary,
      todaySummary,
      updateBusiness,
      completeBusinessSetup,
      completeAccountsConnected,
      updateProfile,
      connectProvider,
      disconnectProvider,
      addTransaction,
      updateTransaction,
      markReconciled,
      runTallySync,
      grantConsent,
      declineConsent,
      toggleNotification,
      logActivity,
      logOut,
      resetApp,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
}
