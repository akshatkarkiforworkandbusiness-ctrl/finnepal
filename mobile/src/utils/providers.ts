import { PROVIDERS } from "@/data/mockAccounts";
import { Provider, ProviderId } from "@/types";

const byId = new Map<ProviderId, Provider>(PROVIDERS.map((p) => [p.id, p]));

export function getProvider(id: ProviderId): Provider {
  const provider = byId.get(id);
  if (!provider) throw new Error(`Unknown provider: ${id}`);
  return provider;
}
