import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

import { getAccessToken, clearTokens } from "@/api/client";
import { getMe, type CustomerMe } from "@/api/users";

interface AuthContextValue {
  customer: CustomerMe | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  setCustomer: (c: CustomerMe) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomerState] = useState<CustomerMe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) {
      setCustomerState(null);
      return;
    }
    try {
      const me = await getMe();
      setCustomerState(me);
    } catch {
      await clearTokens();
      setCustomerState(null);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  const logout = useCallback(async () => {
    await clearTokens();
    setCustomerState(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ customer, isLoading, isAuthenticated: !!customer, refresh, setCustomer: setCustomerState, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
