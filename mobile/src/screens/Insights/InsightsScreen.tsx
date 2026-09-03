import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/Card";
import { CashFlowChart } from "@/components/CashFlowChart";
import { Icon } from "@/components/Icon";
import { InsightCard } from "@/components/InsightCard";
import { SectionHeader } from "@/components/SectionHeader";
import { StatTile } from "@/components/StatTile";
import { RootStackParamList } from "@/navigation/types";
import {
  cashFlowTotals,
  customerConcentration,
  expenseToIncomeRatio,
  filterByPeriod,
  monthOverMonthChange,
  monthlySeries,
  Period,
  revenueVolatility,
  topTransactions,
} from "@/services/analyticsService";
import { useAppState } from "@/state/AppContext";
import { colors, radius, spacing, typography } from "@/theme";
import { formatNPR } from "@/utils/format";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PERIODS: { id: Period; label: string }[] = [
  { id: "thisMonth", label: "This Month" },
  { id: "lastMonth", label: "Last Month" },
  { id: "all", label: "All Time" },
];

export function InsightsScreen() {
  const navigation = useNavigation<Nav>();
  const { transactions } = useAppState();
  const [period, setPeriod] = useState<Period>("thisMonth");
  const [periodMenuOpen, setPeriodMenuOpen] = useState(false);

  const scoped = useMemo(() => filterByPeriod(transactions, period), [transactions, period]);
  const totals = useMemo(() => cashFlowTotals(scoped), [scoped]);
  const series = useMemo(() => monthlySeries(transactions, 6), [transactions]);
  const mom = useMemo(() => monthOverMonthChange(transactions), [transactions]);
  const ratio = useMemo(() => expenseToIncomeRatio(scoped), [scoped]);
  const volatility = useMemo(() => revenueVolatility(transactions), [transactions]);
  const concentration = useMemo(() => customerConcentration(scoped), [scoped]);
  const topIncome = useMemo(() => topTransactions(scoped, "income", 1)[0], [scoped]);
  const topExpense = useMemo(() => topTransactions(scoped, "expense", 1)[0], [scoped]);

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Insights</Text>
          <TouchableOpacity onPress={() => setPeriodMenuOpen((v) => !v)} style={styles.periodBtn}>
            <Text style={styles.periodLabel}>{PERIODS.find((p) => p.id === period)?.label}</Text>
            <Icon name="chevron-down" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
        {periodMenuOpen ? (
          <View style={styles.periodMenu}>
            {PERIODS.map((p) => (
              <TouchableOpacity
                key={p.id}
                onPress={() => {
                  setPeriod(p.id);
                  setPeriodMenuOpen(false);
                }}
                style={styles.periodMenuItem}
              >
                <Text style={[styles.periodMenuLabel, p.id === period && { color: colors.brand, fontWeight: "800" }]}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>

      <ScrollView style={styles.scrollBg} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <StatTile icon="arrow-down-left" label="Total Sales" value={formatNPR(totals.income)} tone="success" />
          <StatTile icon="arrow-up-right" label="Total Expenses" value={formatNPR(totals.expenses)} tone="danger" />
          <StatTile icon="trending-up" label="Net Cash Flow" value={formatNPR(totals.net)} tone="info" />
          <StatTile icon="bar-chart-2" label="Transactions" value={String(scoped.length)} tone="brand" />
        </View>

        <Card style={styles.section}>
          <SectionHeader title="Cash Flow Trend" />
          <CashFlowChart data={series} />
        </Card>

        <View style={styles.linkGrid}>
          <TouchableOpacity style={styles.linkCard} onPress={() => navigation.navigate("SalesAnalytics")} activeOpacity={0.8}>
            <Icon name="bar-chart-2" size={18} color={colors.brand} />
            <Text style={styles.linkLabel}>Sales Analytics</Text>
            <Icon name="chevron-right" size={16} color={colors.textFaint} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkCard} onPress={() => navigation.navigate("ExpenseAnalytics")} activeOpacity={0.8}>
            <Icon name="arrow-up-right" size={18} color={colors.brand} />
            <Text style={styles.linkLabel}>Expense Analytics</Text>
            <Icon name="chevron-right" size={16} color={colors.textFaint} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkCard} onPress={() => navigation.navigate("CashFlow")} activeOpacity={0.8}>
            <Icon name="trending-up" size={18} color={colors.brand} />
            <Text style={styles.linkLabel}>Cash Flow</Text>
            <Icon name="chevron-right" size={16} color={colors.textFaint} />
          </TouchableOpacity>
        </View>

        <Text style={[typography.h3, styles.moreLabel]}>More insights</Text>

        {mom.available ? (
          <InsightCard
            label="Month-over-month change"
            value={mom.netChangePercent !== undefined ? `${mom.netChangePercent >= 0 ? "+" : ""}${mom.netChangePercent.toFixed(1)}% net cash flow` : "—"}
            note={`Income ${mom.incomeChangePercent !== undefined ? `${mom.incomeChangePercent >= 0 ? "+" : ""}${mom.incomeChangePercent.toFixed(1)}%` : "—"} · Expenses ${mom.expenseChangePercent !== undefined ? `${mom.expenseChangePercent >= 0 ? "+" : ""}${mom.expenseChangePercent.toFixed(1)}%` : "—"} vs last month`}
          />
        ) : (
          <InsightCard label="Month-over-month change" value="Not enough history yet" />
        )}

        <InsightCard
          label="Expense-to-income ratio"
          value={ratio !== undefined ? ratio.toFixed(2) : "—"}
          note={ratio !== undefined ? `You spend ${formatNPR(ratio)} for every Rs. 1 of income this period.` : "No income recorded for this period."}
        />

        {volatility.available ? (
          <InsightCard
            label="Revenue volatility"
            value={`${volatility.coefficientOfVariation!.toFixed(1)}%`}
            note={`Coefficient of variation across ${volatility.monthsOfHistory} months of income.`}
          />
        ) : (
          <InsightCard label="Revenue volatility" value="Not enough history yet" note="Requires at least 3 months of income data." />
        )}

        {topIncome || topExpense ? (
          <InsightCard
            label="Top individual transactions"
            value={topIncome ? formatNPR(topIncome.amount) : "—"}
            note={[
              topIncome ? `Largest sale: ${topIncome.description} (${formatNPR(topIncome.amount)})` : null,
              topExpense ? `Largest expense: ${topExpense.description} (${formatNPR(topExpense.amount)})` : null,
            ]
              .filter(Boolean)
              .join("\n")}
          />
        ) : null}

        {concentration.hasCustomerData ? (
          <InsightCard
            label="Customer revenue concentration"
            value={`Top customer: ${concentration.top1Percent.toFixed(0)}% of revenue`}
            note={`Top 3 customers: ${concentration.top3Percent.toFixed(0)}% · Top 5 customers: ${concentration.top5Percent.toFixed(0)}%`}
          />
        ) : (
          <InsightCard label="Customer revenue concentration" value="No customer tagging yet" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: { backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { color: colors.text, fontSize: 22, fontWeight: "800" },
  periodBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.bg, borderRadius: radius.pill, paddingHorizontal: spacing.sm + 2, paddingVertical: 7 },
  periodLabel: { color: colors.textMuted, fontWeight: "700", fontSize: 13 },
  periodMenu: { backgroundColor: colors.white, borderRadius: radius.md, marginTop: spacing.xs, overflow: "hidden", alignSelf: "flex-end", borderWidth: 1, borderColor: colors.border },
  periodMenuItem: { paddingHorizontal: spacing.md, paddingVertical: 10 },
  periodMenuLabel: { fontSize: 13, fontWeight: "600", color: colors.text },
  scrollBg: { flex: 1, backgroundColor: colors.bg },
  body: { paddingTop: spacing.md, paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  section: { marginBottom: spacing.md },
  linkGrid: { gap: spacing.sm, marginBottom: spacing.md },
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm + 4,
  },
  linkLabel: { flex: 1, fontSize: 14, fontWeight: "700", color: colors.text },
  moreLabel: { marginBottom: spacing.sm },
});
