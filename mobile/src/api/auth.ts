import { apiRequest, setTokens } from "./client";

interface OtpSentResponse {
  message: string;
  requires_registration: boolean;
}

interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export function login(email: string) {
  return apiRequest<OtpSentResponse>("/auth/customer/login", { method: "POST", body: { email } });
}

export function register(email: string, name: string) {
  return apiRequest<OtpSentResponse>("/auth/customer/register", { method: "POST", body: { email, name } });
}

export async function verifyOtp(email: string, code: string): Promise<void> {
  const tokens = await apiRequest<TokenPair>("/auth/customer/verify-otp", { method: "POST", body: { email, code } });
  await setTokens(tokens.access_token, tokens.refresh_token);
}

export function resendOtp(email: string) {
  return apiRequest<OtpSentResponse>("/auth/customer/resend-otp", { method: "POST", body: { email } });
}
