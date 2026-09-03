import { apiRequest } from "./client";

interface BusinessRead {
  id: string;
  name: string;
  type: string | null;
  location: string | null;
}

const CACHE_KEY = "orbit.customer.realBusinessId";

async function listBusinesses(): Promise<BusinessRead[]> {
  return apiRequest<BusinessRead[]>("/businesses", { auth: true });
}

async function createBusiness(name: string, type?: string, location?: string): Promise<BusinessRead> {
  return apiRequest<BusinessRead>("/businesses", { method: "POST", body: { name, type, location }, auth: true });
}

/** The mobile app's local `business` is mock/on-device data with a fake id.
 * Real payment collection needs a real backend business row, so this lazily
 * creates one (named after the local mock business) the first time it's
 * needed, then reuses it. */
export async function getOrCreateRealBusinessId(localName: string, localType?: string, localLocation?: string): Promise<string> {
  const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
  const cached = await AsyncStorage.getItem(CACHE_KEY);
  if (cached) return cached;

  const existing = await listBusinesses();
  if (existing.length > 0) {
    await AsyncStorage.setItem(CACHE_KEY, existing[0].id);
    return existing[0].id;
  }

  const created = await createBusiness(localName, localType, localLocation);
  await AsyncStorage.setItem(CACHE_KEY, created.id);
  return created.id;
}
