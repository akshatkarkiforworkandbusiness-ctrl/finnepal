import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/theme";

interface Point {
  label: string;
  income: number;
  expense: number;
}

interface Props {
  data: Point[];
}

export function CashFlowChart({ data }: Props) {
  const max = Math.max(...data.map((d) => Math.max(d.income, d.expense)), 1);
  return (
    <View>
      <View style={styles.chart}>
        {data.map((d) => (
          <View key={d.label} style={styles.column}>
            <View style={styles.bars}>
              <View style={[styles.bar, { height: (d.income / max) * 100, backgroundColor: colors.brand }]} />
              <View style={[styles.bar, { height: (d.expense / max) * 100, backgroundColor: colors.red }]} />
            </View>
            <Text style={styles.label}>{d.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.brand }]} />
          <Text style={styles.legendLabel}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.red }]} />
          <Text style={styles.legendLabel}>Expense</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { flexDirection: "row", alignItems: "flex-end", height: 120, justifyContent: "space-between" },
  column: { alignItems: "center", flex: 1 },
  bars: { flexDirection: "row", alignItems: "flex-end", height: 100, gap: 3 },
  bar: { width: 8, borderRadius: 4, minHeight: 4 },
  label: { fontSize: 10, color: colors.textFaint, marginTop: 6, fontWeight: "600" },
  legend: { flexDirection: "row", gap: spacing.md, marginTop: spacing.sm, justifyContent: "center" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 12, color: colors.textMuted, fontWeight: "600" },
});
