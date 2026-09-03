import { StatusBadge } from "./StatusBadge";
import type { ConsentStatus } from "@/types";

export function ConsentBadge({ status }: { status: ConsentStatus }) {
  return <StatusBadge status={status} />;
}
