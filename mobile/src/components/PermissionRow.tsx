import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Icon } from "./Icon";
import { colors, spacing } from "@/theme";

interface Props {
  label: string;
  allowed: boolean;
}

export function PermissionRow({ label, allowed }: Props) {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: allowed ? colors.successSoft : colors.redSoft }]}>
        <Icon name={allowed ? "check" : "x"} size={12} color={allowed ? colors.success : colors.red} />
      </View>
      <Text style={[styles.label, !allowed && styles.labelMuted]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 6, gap: spacing.sm },
  dot: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 14, color: colors.text, fontWeight: "500" },
  labelMuted: { color: colors.textMuted },
});
