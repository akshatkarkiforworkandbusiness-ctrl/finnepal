import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "@/theme";

export function PeriodPill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { backgroundColor: colors.bg, borderRadius: radius.pill, paddingHorizontal: spacing.sm + 2, paddingVertical: 6 },
  label: { fontSize: 12, fontWeight: "700", color: colors.textMuted },
});
