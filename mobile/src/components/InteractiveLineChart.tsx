import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { LineAreaChart, LinePoint } from "./LineAreaChart";
import { colors, radius, spacing } from "@/theme";
import { formatNPR } from "@/utils/format";

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
  data: LinePoint[];
}

interface Props {
  title: string;
  subtitle?: string;
  series: ChartSeries[];
}

export function InteractiveLineChart({ title, subtitle, series }: Props) {
  const [activeKey, setActiveKey] = useState(series[0]?.key);
  const active = series.find((s) => s.key === activeKey) ?? series[0];

  const totals = useMemo(() => {
    const map = new Map<string, number>();
    series.forEach((s) => map.set(s.key, s.data.reduce((sum, p) => sum + p.value, 0)));
    return map;
  }, [series]);

  if (!active) return null;

  return (
    <View style={styles.card}>
      <View style={styles.titleBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.tabRow}>
        {series.map((s, i) => {
          const isActive = s.key === active.key;
          return (
            <TouchableOpacity
              key={s.key}
              onPress={() => setActiveKey(s.key)}
              activeOpacity={0.8}
              style={[
                styles.tab,
                isActive && { backgroundColor: colors.bg, borderBottomColor: s.color },
                i > 0 && styles.tabDivider,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={styles.tabLabel}>{s.label}</Text>
              <Text style={[styles.tabValue, { color: isActive ? s.color : colors.text }]}>{formatNPR(totals.get(s.key) ?? 0)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.chartWrap}>
        <LineAreaChart data={active.data} color={active.color} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  titleBlock: { paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.sm },
  title: { fontSize: 15, fontWeight: "800", color: colors.text },
  subtitle: { fontSize: 12, color: colors.textFaint, marginTop: 2 },
  tabRow: { flexDirection: "row", borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  tab: { flex: 1, paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.sm, gap: 2, borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabDivider: { borderLeftWidth: 1, borderLeftColor: colors.border },
  tabLabel: { fontSize: 11, color: colors.textMuted, fontWeight: "600" },
  tabValue: { fontSize: 17, fontWeight: "800" },
  chartWrap: { padding: spacing.md },
});
