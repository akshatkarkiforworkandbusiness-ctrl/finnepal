import { ADAPTERS } from "@/data/adapters";
import { ProviderId } from "@/types";
import { apiRequest } from "@/api/client";
import { getOrCreateRealBusinessId } from "@/api/businesses";

/** Real backend connection: creates an actual DEMO-mode ProviderConnection
 * row and syncs synthetic (metadata.mode=DEMO) transactions — genuinely
 * persisted, honestly labeled, since no real Nepali bank/wallet API is
 * publicly available to connect to for real. Best-effort: if the user isn't
 * logged in yet or the call fails, the local mock connection still succeeds
 * so the UI keeps working exactly as before. */
async function connectReal(providerId: ProviderId, businessName: string, businessType?: string, businessLocation?: string) {
  try {
    const businessId = await getOrCreateRealBusinessId(businessName, businessType, businessLocation);
    await apiRequest(`/providers/${providerId}/demo/connect`, { method: "POST", body: { business_id: businessId }, auth: true });
    await apiRequest(`/providers/${providerId}/sync`, { method: "POST", auth: true });
  } catch {
    // Best-effort — the local mock connection below is the UI's source of
    // truth today, so a backend hiccup (or no session yet) shouldn't block it.
  }
}

/** Simulated account connection UI-wise (no real credentials, OTP, or MPIN
 * are ever requested) — but now backed by a real DEMO connection + sync on
 * the server too, see connectReal above. */
export async function connect(
  providerId: ProviderId,
  business?: { name: string; type?: string; location?: string }
): Promise<{ success: true }> {
  if (business) connectReal(providerId, business.name, business.type, business.location);

  const adapter = ADAPTERS[providerId];
  if (adapter) return adapter.authorize();
  await new Promise((resolve) => setTimeout(resolve, 1600));
  return { success: true };
}
