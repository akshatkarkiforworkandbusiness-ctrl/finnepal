import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, clearTokens, getAccessToken, setTokens, ApiError } from "@/lib/api";
import type { AdminMe, TokenPair } from "@/types/api";

interface AuthContextValue {
  admin: AdminMe | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminMe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!getAccessToken()) {
      setIsLoading(false);
      return;
    }
    api
      .get<AdminMe>("/admin/me")
      .then(setAdmin)
      .catch((err) => {
        if (err instanceof ApiError) clearTokens();
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string, remember = true) {
    const tokens = await api.post<TokenPair>("/auth/admin/login", { email, password });
    setTokens(tokens.access_token, tokens.refresh_token, remember);
    const me = await api.get<AdminMe>("/admin/me");
    setAdmin(me);
  }

  function logout() {
    clearTokens();
    setAdmin(null);
  }

  async function refresh() {
    const me = await api.get<AdminMe>("/admin/me");
    setAdmin(me);
  }

  return (
    <AuthContext.Provider value={{ admin, isLoading, isAuthenticated: !!admin, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
