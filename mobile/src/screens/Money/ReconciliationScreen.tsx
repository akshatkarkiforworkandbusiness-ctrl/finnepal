import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { Icon, IconName } from "@/components/Icon";
import { Header } from "@/components/Header";
import { PeriodPill } from "@/components/PeriodPill";
import { ReconciliationRow } from "@/components/ReconciliationRow";
import { RootStackParamList } from "@/navigation/types";
import { reconciliationSummary } from "@/services/reconciliationService";
import { useAppState } from "@/state/AppContext";
import { colors, radius, spacing } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Reconciliation">;

const STATUS_ORDER: Record<string, number> = { mismatched: 0, pending: 1, matched: 2 };

function SummaryTile({ icon, value, label, caption, bg, fg }: { icon: IconName; value: string | number; label: string; caption: string; bg: string; fg: string }) {
  return (
    <View style={[styles.summaryCard, { backgroundColor: bg }]}>
      <View style={styles.summaryTop}>
        <Icon name={icon} size={15} color={fg} />
        <Text style={[styles.summaryValue, { color: fg }]}>{value}</Text>
      </View>
      <Text style={[styles.summaryLabel, { color: fg }]}>{label}</Text>
      <Text style={[styles.summaryCaption, { color: fg }]}>{caption}</Text>
    </View>
  );
}

export function ReconciliationScreen({ navigation }: Props) {
  const { transactions } = useAppState();
  const summary = useMemo(() => reconciliationSummary(transactions), [transactions]);
  const sorted = useMemo(
    () => [...transactions].sort((a, b) => STATUS_ORDER[a.reconciliationStatus] - STATUS_ORDER[b.reconciliationStatus]),
    [transactions]
  );

  return (
    <View style={styles.root}>
      <Header title="Reconciliation" onBack={() => navigation.goBack()} right={<PeriodPill label="This Month" />} />
      <View style={styles.summaryGrid}>
        <SummaryTile icon="check-circle" value={summary.matched} label="Matched" caption="Good job!" bg={colors.successSoft} fg={colors.success} />
        <SummaryTile icon="clock" value={summary.pending} label="Pending" caption="Needs review" bg={colors.warningSoft} fg={colors.warning} />
        <SummaryTile icon="alert-triangle" value={summary.mismatched} label="Mismatched" caption="Action required" bg={colors.redSoft} fg={colors.red} />
        <SummaryTile icon="bar-chart-2" value={`${summary.matchedPercent}%`} label="Match Rate" caption="Overall" bg={colors.brandLight} fg={colors.brand} />
      </View>

      <Text style={styles.listLabel}>Recent Items</Text>
      <FlatList
        data={sorted}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon="check-circle" title="No reconciliation issues" description="Nothing to reconcile yet — add transactions to see them here." />}
        renderItem={({ item }) => (
          <ReconciliationRow
            label={item.description}
            date={item.date}
            orbitAmount={item.amount}
            tallyAmount={item.tallyAmount}
            status={item.reconciliationStatus}
            onPress={() => navigation.navigate("ReconciliationDetail", { transactionId: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  summaryCard: { flexBasis: "47%", borderRadius: radius.md, padding: spacing.sm + 4 },
  summaryTop: { flexDirection: "row", alignItems: "center", gap: 6 },
  summaryValue: { fontSize: 20, fontWeight: "800" },
  summaryLabel: { fontSize: 12, fontWeight: "700", marginTop: 4 },
  summaryCaption: { fontSize: 11, fontWeight: "600", marginTop: 2, opacity: 0.8 },
  listLabel: { fontSize: 13, fontWeight: "700", color: colors.textMuted, paddingHorizontal: spacing.lg, marginTop: spacing.md, marginBottom: spacing.xs },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
});
