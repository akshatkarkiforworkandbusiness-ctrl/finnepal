import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { BREAKDOWN_PALETTE, CategoryBreakdown } from "@/components/CategoryBreakdown";
import { DonutChart } from "@/components/DonutChart";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { PeriodPill } from "@/components/PeriodPill";
import { ScreenContainer } from "@/components/ScreenContainer";
import { RootStackParamList } from "@/navigation/types";
import { expenseCategoryBreakdown, filterByPeriod } from "@/services/analyticsService";
import { useAppState } from "@/state/AppContext";
import { colors, spacing } from "@/theme";
import { formatNPR } from "@/utils/format";

type Props = NativeStackScreenProps<RootStackParamList, "ExpenseAnalytics">;

export function ExpenseAnalyticsScreen({ navigation }: Props) {
  const { transactions } = useAppState();
  const scoped = useMemo(() => filterByPeriod(transactions, "thisMonth"), [transactions]);
  const byCategory = useMemo(() => expenseCategoryBreakdown(scoped), [scoped]);
  const total = byCategory.reduce((s, c) => s + c.amount, 0);

  return (
    <View style={styles.root}>
      <Header title="Expense Analytics" onBack={() => navigation.goBack()} right={<PeriodPill label="This Month" />} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        {byCategory.length === 0 ? (
          <EmptyState icon="arrow-up-right" title="No expense data" description="No expense data for this period." />
        ) : (
          <>
            <View style={styles.donutWrap}>
              <DonutChart
                data={byCategory.map((c, i) => ({ label: c.label, amount: c.amount, color: BREAKDOWN_PALETTE[i % BREAKDOWN_PALETTE.length] }))}
                centerLabel="Total"
                centerValue={formatNPR(total)}
              />
            </View>
            <CategoryBreakdown items={byCategory} />
          </>
        )}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  donutWrap: { alignItems: "center", marginVertical: spacing.md },
});
