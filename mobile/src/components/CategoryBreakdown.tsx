import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/theme";
import { formatNPR } from "@/utils/format";

/** Shared palette so a DonutChart and its accompanying breakdown list always agree on color. */
export const BREAKDOWN_PALETTE = [colors.brand, colors.red, "#4C8C6B", "#D98A3D", "#7A6FB0", "#3F7CAC", "#B0715C"];

export interface BreakdownItem {
  label: string;
  amount: number;
  percent: number;
}

interface Props {
  items: BreakdownItem[];
  palette?: string[];
}

export function CategoryBreakdown({ items, palette = BREAKDOWN_PALETTE }: Props) {
  return (
    <View>
      {items.map((item, i) => (
        <View key={item.label} style={[styles.row, i === items.length - 1 && { borderBottomWidth: 0 }]}>
          <View style={[styles.dot, { backgroundColor: palette[i % palette.length] }]} />
          <Text style={styles.label} numberOfLines={1}>
            {item.label}
          </Text>
          <Text style={styles.percent}>{item.percent.toFixed(0)}%</Text>
          <Text style={styles.amount}>{formatNPR(item.amount)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  label: { flex: 1, fontSize: 14, fontWeight: "600", color: colors.text },
  percent: { fontSize: 13, fontWeight: "700", color: colors.textMuted, width: 40 },
  amount: { fontSize: 13, fontWeight: "700", color: colors.text, width: 90, textAlign: "right" },
});
