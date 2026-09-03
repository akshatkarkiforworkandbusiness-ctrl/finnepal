import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Badge } from "./Badge";
import { Icon } from "./Icon";
import { ProviderBadge } from "./ProviderBadge";
import { colors, radius, spacing } from "@/theme";
import { Provider } from "@/types";

export type ConnectionCardStatus = "connect" | "connected" | "sandbox";

const STATUS_LABEL: Record<ConnectionCardStatus, string> = {
  connect: "Connect",
  connected: "Connected",
  sandbox: "Sandbox",
};

interface Props {
  provider: Provider;
  status: ConnectionCardStatus;
  onPress?: () => void;
  description?: string;
}

export function AccountConnectionCard({ provider, status, onPress, description }: Props) {
  const disabled = status === "connected" && !onPress;
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8} style={styles.card} accessibilityRole="button">
      <ProviderBadge provider={provider} size={40} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {provider.name}
        </Text>
        {description ? (
          <Text style={styles.desc} numberOfLines={1}>
            {description}
          </Text>
        ) : null}
      </View>
      <Badge label={STATUS_LABEL[status]} tone={status === "connected" ? "success" : status === "sandbox" ? "warning" : "brand"} />
      <Icon name="chevron-right" size={16} color={colors.textFaint} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm + 4,
    marginBottom: spacing.sm,
  },
  info: { flex: 1, minWidth: 0 },
  name: { fontSize: 14, fontWeight: "700", color: colors.text },
  desc: { fontSize: 12, color: colors.textFaint, marginTop: 2 },
});
