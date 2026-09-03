import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

const FEATHER_NAMES = [
  "home", "credit-card", "shield", "lock", "unlock", "arrow-up", "arrow-down",
  "arrow-up-right", "arrow-down-left", "bar-chart-2", "target", "user", "settings",
  "link", "eye", "eye-off", "check", "check-circle", "alert-triangle", "bell",
  "x", "chevron-right", "chevron-left", "chevron-down", "search", "download", "share-2", "plus",
  "trending-up", "trending-down", "clock", "map-pin", "smartphone", "globe",
  "info", "help-circle", "log-out", "edit-2", "camera", "briefcase", "layers",
  "refresh-cw", "wifi-off", "inbox", "award", "file-text", "grid", "gift",
  "message-circle", "send",
] as const;

type FeatherIconName = (typeof FEATHER_NAMES)[number];

const MCI_MAP = {
  bank: "bank-outline",
  wallet: "wallet-outline",
  insurance: "umbrella-outline",
  qrcode: "qrcode",
  fingerprint: "fingerprint",
  grocery: "cart-outline",
  restaurant: "silverware-fork-knife",
  clothing: "tshirt-crew-outline",
  pharmacy: "pill",
  electronics: "cellphone",
  storefront: "storefront-outline",
  sync: "sync",
  "file-xml": "xml",
} as const;

export type IconName = FeatherIconName | keyof typeof MCI_MAP;

interface Props {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 20, color = "#1A1A1A" }: Props) {
  if (name in MCI_MAP) {
    const mciName = MCI_MAP[name as keyof typeof MCI_MAP];
    return <MaterialCommunityIcons name={mciName} size={size} color={color} />;
  }
  return <Feather name={name as FeatherIconName} size={size} color={color} />;
}
