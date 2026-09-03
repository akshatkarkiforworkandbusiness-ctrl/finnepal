import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { LineAreaChart } from "@/components/LineAreaChart";
import { PeriodPill } from "@/components/PeriodPill";
import { ScreenContainer } from "@/components/ScreenContainer";
import { RootStackParamList } from "@/navigation/types";
import { cashFlowTotals, filterByPeriod, monthOverMonthChange } from "@/services/analyticsService";
import { useAppState } from "@/state/AppContext";
import { colors, spacing } from "@/theme";
import { dailySeries } from "@/utils/finance";
import { formatDate, formatNPR } from "@/utils/format";

type Props = NativeStackScreenProps<RootStackParamList, "CashFlow">;

export function CashFlowScreen({ navigation }: Props) {
  const { transactions } = useAppState();
  const scoped = useMemo(() => filterByPeriod(transactions, "thisMonth"), [transactions]);
  const totals = useMemo(() => cashFlowTotals(scoped), [scoped]);
  const mom = useMemo(() => monthOverMonthChange(transactions), [transactions]);

  const trend = useMemo(() => {
    const days = dailySeries(transactions, 20);
    return days.map((d) => ({ label: d.label, value: d.income - d.expense }));
  }, [transactions]);

  return (
    <View style={styles.root}>
      <Header title="Cash Flow Trend" onBack={() => navigation.goBack()} right={<PeriodPill label="This Month" />} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        <View style={styles.netBlock}>
          <Text style={styles.netLabel}>Net Cash Flow</Text>
          <Text style={[styles.netValue, { color: totals.net >= 0 ? colors.success : colors.red }]}>{formatNPR(totals.net)}</Text>
          {mom.available && mom.netChangePercent !== undefined ? (
            <Text style={[styles.momText, { color: mom.netChangePercent >= 0 ? colors.success : colors.red }]}>
              {mom.netChangePercent >= 0 ? "↑" : "↓"} {Math.abs(mom.netChangePercent).toFixed(1)}% vs last month
            </Text>
          ) : null}
        </View>

        <Card style={styles.chartCard}>
          <LineAreaChart data={trend} color={colors.brand} />
        </Card>

        <Card style={styles.totalsCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Income</Text>
            <Text style={styles.totalValue}>{formatNPR(totals.income)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Expenses</Text>
            <Text style={styles.totalValue}>{formatNPR(totals.expenses)}</Text>
          </View>
          <View style={[styles.totalRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.totalLabel}>Net Cash Flow</Text>
            <Text style={[styles.totalValue, { color: totals.net >= 0 ? colors.success : colors.red }]}>{formatNPR(totals.net)}</Text>
          </View>
        </Card>
        <Text style={styles.asOf}>As of {formatDate(new Date().toISOString())}</Text>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  netBlock: { alignItems: "center", marginBottom: spacing.md },
  netLabel: { fontSize: 13, color: colors.textMuted, fontWeight: "600" },
  netValue: { fontSize: 30, fontWeight: "800", marginTop: 4 },
  momText: { fontSize: 13, fontWeight: "700", marginTop: 4 },
  chartCard: { marginBottom: spacing.md },
  totalsCard: {},
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  totalLabel: { fontSize: 14, color: colors.textMuted, fontWeight: "600" },
  totalValue: { fontSize: 16, fontWeight: "800", color: colors.text },
  asOf: { fontSize: 11, color: colors.textFaint, textAlign: "center", marginTop: spacing.sm },
});
