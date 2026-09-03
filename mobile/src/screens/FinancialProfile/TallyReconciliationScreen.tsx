import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { ReconciliationRow } from "@/components/ReconciliationRow";
import { RootStackParamList } from "@/navigation/types";
import { tallyReconciliationSummary } from "@/services/reconciliationService";
import { useAppState } from "@/state/AppContext";
import { colors, spacing } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "TallyReconciliation">;

export function TallyReconciliationScreen({ navigation }: Props) {
  const { transactions } = useAppState();
  const summary = useMemo(() => tallyReconciliationSummary(transactions), [transactions]);
  const synced = useMemo(
    () => transactions.filter((t) => t.tallyStatus === "synced" && t.tallyAmount !== undefined),
    [transactions]
  );

  return (
    <View style={styles.root}>
      <Header title="Tally Reconciliation" onBack={() => navigation.goBack()} />
      <View style={styles.summaryRow}>
        <Card style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: colors.success }]}>{summary.matched}</Text>
          <Text style={styles.summaryLabel}>Matched</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: colors.warning }]}>{summary.needsReview}</Text>
          <Text style={styles.summaryLabel}>Needs Review</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: colors.red }]}>{summary.failed}</Text>
          <Text style={styles.summaryLabel}>Failed</Text>
        </Card>
      </View>

      <FlatList
        data={synced}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon="sync" title="Nothing synced yet" description="Run a Tally sync to see reconciled records here." />}
        renderItem={({ item }) => (
          <ReconciliationRow
            label={item.description}
            date={item.date}
            orbitAmount={item.amount}
            tallyAmount={item.tallyAmount}
            status={item.tallyAmount === item.amount ? "matched" : "mismatched"}
            onPress={() => navigation.navigate("ReconciliationDetail", { transactionId: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  summaryRow: { flexDirection: "row", gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  summaryCard: { flex: 1, alignItems: "center" },
  summaryValue: { fontSize: 24, fontWeight: "800" },
  summaryLabel: { fontSize: 12, color: colors.textMuted, fontWeight: "600", marginTop: 2 },
  list: { padding: spacing.lg, paddingBottom: spacing.xxl },
});
