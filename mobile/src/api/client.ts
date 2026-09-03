import AsyncStorage from "@react-native-async-storage/async-storage";

// Matches the EXPO_PUBLIC_API_BASE_URL convention used by docker-compose.yml
// and .env.example (mirrors admin's VITE_API_BASE_URL + "/api/v1" pattern).
// On a physical device via Expo Go, "localhost" means the phone itself —
// set EXPO_PUBLIC_API_BASE_URL to your computer's LAN IP (e.g.
// http://192.168.1.79:8000) instead.
const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8000") + "/api/v1";

const ACCESS_TOKEN_KEY = "orbit.customer.accessToken";
const REFRESH_TOKEN_KEY = "orbit.customer.refreshToken";

export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
}

async function getRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  await AsyncStorage.multiSet([
    [ACCESS_TOKEN_KEY, accessToken],
    [REFRESH_TOKEN_KEY, refreshToken],
  ]);
}

export async function clearTokens(): Promise<void> {
  await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.auth) {
    const token = await getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

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
