const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000") + "/api/v1";

const ACCESS_TOKEN_KEY = "orbit_admin_access_token";
const REFRESH_TOKEN_KEY = "orbit_admin_refresh_token";
const REMEMBER_KEY = "orbit_admin_remember";

// "Remember me" decides which Storage tokens live in: localStorage survives
// browser restarts, sessionStorage is cleared when the tab/browser closes.
// The choice itself is remembered in localStorage so a token refresh (which
// re-calls setTokens) keeps writing to the same place.
function activeStorage(): Storage {
  return localStorage.getItem(REMEMBER_KEY) === "0" ? sessionStorage : localStorage;
}

export function getAccessToken(): string | null {
  return activeStorage().getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken(): string | null {
  return activeStorage().getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string, remember?: boolean) {
  if (remember !== undefined) {
    localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
  }
  const storage = activeStorage();
  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens() {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem(ACCESS_TOKEN_KEY);
    storage.removeItem(REFRESH_TOKEN_KEY);
  }
  localStorage.removeItem(REMEMBER_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  const res = await fetch(`${API_BASE_URL}/auth/admin/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!res.ok) return false;

  const data = await res.json();
  setTokens(data.access_token, data.refresh_token);
  return true;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  params?: Record<string, string | number | undefined>;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}, _retried = false): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const token = getAccessToken();
  const res = await fetch(url.toString(), {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401 && !_retried && getRefreshToken()) {
    refreshPromise ??= refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
    const refreshed = await refreshPromise;
    if (refreshed) {
      return apiRequest<T>(path, options, true);
    }
  }

  if (res.status === 401) {
    clearTokens();
    window.location.href = "/login";
    throw new ApiError(401, "Not authenticated");
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      // response wasn't JSON; fall back to statusText
    }
    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string, params?: RequestOptions["params"]) => apiRequest<T>(path, { params }),
  post: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => apiRequest<T>(path, { method: "DELETE" }),
};
