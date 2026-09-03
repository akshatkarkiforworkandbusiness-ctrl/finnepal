import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Icon, IconName } from "./Icon";
import { colors, radius, spacing } from "@/theme";

type Tone = "brand" | "success" | "danger" | "info";

const TONE_STYLES: Record<Tone, { bg: string; fg: string }> = {
  brand: { bg: colors.brandLight, fg: colors.brand },
  success: { bg: colors.successSoft, fg: colors.success },
  danger: { bg: colors.redSoft, fg: colors.red },
  info: { bg: colors.infoSoft, fg: colors.info },
};

interface Props {
  icon: IconName;
  label: string;
  value: string;
  changeLabel?: string;
  positive?: boolean;
  tone?: Tone;
}

export function StatTile({ icon, label, value, changeLabel, positive, tone = "brand" }: Props) {
  const t = TONE_STYLES[tone];
  return (
    <View style={styles.tile}>
      <View style={[styles.iconBadge, { backgroundColor: t.bg }]}>
        <Icon name={icon} size={15} color={t.fg} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {changeLabel ? (
        <Text style={[styles.change, { color: positive ? colors.success : colors.red }]}>{changeLabel}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexBasis: "48%",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm + 4,
    marginBottom: spacing.sm,
  },
  iconBadge: { width: 30, height: 30, borderRadius: radius.sm, alignItems: "center", justifyContent: "center", marginBottom: spacing.xs },
  label: { fontSize: 12, color: colors.textMuted, fontWeight: "600" },
  value: { fontSize: 18, fontWeight: "800", color: colors.text, marginTop: 2 },
  change: { fontSize: 12, fontWeight: "700", marginTop: 2 },
});
