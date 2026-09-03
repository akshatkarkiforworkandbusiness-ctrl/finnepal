import { apiRequest } from "./client";

export type PaymentProvider = "esewa" | "khalti";

interface EsewaInitiateResponse {
  payment_intent_id: string;
  redirect_url: string;
}

interface KhaltiInitiateResponse {
  payment_intent_id: string;
  payment_url: string;
}

export interface PaymentIntentStatus {
  id: string;
  provider: "ESEWA" | "KHALTI";
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  failure_reason: string | null;
  transaction_id: string | null;
}

/** Returns one URL to open (system browser) that leads straight to checkout —
 * eSewa's is a GET page that auto-submits the real signed form server-side,
 * Khalti's is its own hosted payment page. Either way the caller doesn't
 * need a WebView. */
export async function initiatePayment(provider: PaymentProvider, businessId: string, amount: number): Promise<{ paymentIntentId: string; url: string }> {
  if (provider === "esewa") {
    const res = await apiRequest<EsewaInitiateResponse>("/payments/esewa/initiate", {
      method: "POST",
      body: { business_id: businessId, amount },
      auth: true,
    });
    return { paymentIntentId: res.payment_intent_id, url: res.redirect_url };
  }
  const res = await apiRequest<KhaltiInitiateResponse>("/payments/khalti/initiate", {
    method: "POST",
    body: { business_id: businessId, amount },
    auth: true,
  });
  return { paymentIntentId: res.payment_intent_id, url: res.payment_url };
}

export function getPaymentStatus(paymentIntentId: string): Promise<PaymentIntentStatus> {
  return apiRequest<PaymentIntentStatus>(`/payments/${paymentIntentId}`, { auth: true });
}
