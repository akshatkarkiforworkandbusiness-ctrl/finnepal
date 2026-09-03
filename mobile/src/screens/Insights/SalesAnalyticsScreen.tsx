import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { BREAKDOWN_PALETTE, CategoryBreakdown } from "@/components/CategoryBreakdown";
import { DonutChart } from "@/components/DonutChart";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { PeriodPill } from "@/components/PeriodPill";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SectionHeader } from "@/components/SectionHeader";
import { RootStackParamList } from "@/navigation/types";
import { channelBreakdown, filterByPeriod, incomeCategoryBreakdown } from "@/services/analyticsService";
import { useAppState } from "@/state/AppContext";
import { colors, spacing } from "@/theme";
import { formatNPR } from "@/utils/format";

type Props = NativeStackScreenProps<RootStackParamList, "SalesAnalytics">;

export function SalesAnalyticsScreen({ navigation }: Props) {
  const { transactions } = useAppState();
  const scoped = useMemo(() => filterByPeriod(transactions, "thisMonth"), [transactions]);
  const byCategory = useMemo(() => incomeCategoryBreakdown(scoped), [scoped]);
  const byChannel = useMemo(() => channelBreakdown(scoped, "income"), [scoped]);
  const total = byCategory.reduce((s, c) => s + c.amount, 0);

  return (
    <View style={styles.root}>
      <Header title="Sales Analytics" onBack={() => navigation.goBack()} right={<PeriodPill label="This Month" />} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        {byCategory.length === 0 ? (
          <EmptyState icon="bar-chart-2" title="No sales data" description="No sales recorded for this period yet." />
        ) : (
          <>
            <SectionHeader title="Sales by Category" />
            <View style={styles.donutWrap}>
              <DonutChart
                data={byCategory.map((c, i) => ({ label: c.label, amount: c.amount, color: BREAKDOWN_PALETTE[i % BREAKDOWN_PALETTE.length] }))}
                centerLabel="Total"
                centerValue={formatNPR(total)}
              />
            </View>
            <CategoryBreakdown items={byCategory} />

            <Text style={styles.spacer} />
            <SectionHeader title="Sales by Channel" />
            <View style={styles.donutWrap}>
              <DonutChart
                data={byChannel.map((c, i) => ({ label: c.label, amount: c.amount, color: BREAKDOWN_PALETTE[i % BREAKDOWN_PALETTE.length] }))}
                centerLabel="Total"
                centerValue={formatNPR(total)}
              />
            </View>
            <CategoryBreakdown items={byChannel} />
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
  spacer: { height: spacing.lg },
});
