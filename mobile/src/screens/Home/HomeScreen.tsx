import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/Card";
import { DisasterReliefBanner } from "@/components/DisasterReliefBanner";
import { EmptyState } from "@/components/EmptyState";
import { HisabKhataBanner } from "@/components/HisabKhataBanner";
import { InsuranceBanner } from "@/components/InsuranceBanner";
import { OffersCard } from "@/components/OffersCard";
import { PaymentBannerSlider } from "@/components/PaymentBannerSlider";
import { Icon } from "@/components/Icon";
import { InteractiveLineChart } from "@/components/InteractiveLineChart";
import { SectionHeader } from "@/components/SectionHeader";
import { TransactionRow } from "@/components/TransactionRow";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, radius, spacing, typography } from "@/theme";
import { dailySeries, forDay, percentChange, summarize } from "@/utils/finance";
import { formatDate, formatNPR } from "@/utils/format";

type Nav = NativeStackNavigationProp<RootStackParamList>;

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function ChangeLabel({ value, invert }: { value: number | null; invert?: boolean }) {
  if (value === null) return null;
  const isUp = value >= 0;
  const isGood = invert ? !isUp : isUp;
  return (
    <Text style={[styles.change, { color: isGood ? colors.success : colors.red }]}>
      {isUp ? "↑" : "↓"} {Math.abs(value).toFixed(1)}% vs yesterday
    </Text>
  );
}

const OVERVIEW_META = {
  sales: { icon: "arrow-down-left" as const, bg: colors.successSoft, fg: colors.success },
  expenses: { icon: "arrow-up-right" as const, bg: colors.redSoft, fg: colors.red },
  net: { icon: "trending-up" as const, bg: colors.infoSoft, fg: colors.info },
};

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { profile, transactions, todaySummary } = useAppState();
  const firstName = profile.fullName.split(" ")[0];

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdaySummary = summarize(forDay(transactions, yesterday));

  const recent = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  const hasActivity = transactions.length > 0;

  const chartSeries = useMemo(() => {
    const daily = dailySeries(transactions, 30);
    return [
      { key: "sales", label: "Sales", color: colors.success, data: daily.map((d) => ({ label: d.label, value: d.income })) },
      { key: "expenses", label: "Expenses", color: colors.red, data: daily.map((d) => ({ label: d.label, value: d.expense })) },
    ];
  }, [transactions]);

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>
              {greeting()},{"\n"}
              {firstName} 👋
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("ActivityLog")}
            style={styles.bellWrap}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Icon name="bell" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollBg} contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <HisabKhataBanner onPress={() => {}} />
        </View>

        <Card style={styles.overviewCard}>
          <View style={styles.overviewHeaderRow}>
            <Text style={typography.label}>Today's Overview</Text>
            <Text style={styles.overviewDate}>{formatDate(new Date().toISOString())}</Text>
          </View>

          <View style={styles.overviewRow}>
            <View style={[styles.overviewIcon, { backgroundColor: OVERVIEW_META.sales.bg }]}>
              <Icon name={OVERVIEW_META.sales.icon} size={16} color={OVERVIEW_META.sales.fg} />
            </View>
            <View style={styles.overviewMain}>
              <Text style={styles.overviewLabel}>Sales</Text>
              <Text style={styles.overviewValue}>{formatNPR(todaySummary.income)}</Text>
            </View>
            <ChangeLabel value={percentChange(todaySummary.income, yesterdaySummary.income)} />
          </View>
          <View style={styles.overviewRow}>
            <View style={[styles.overviewIcon, { backgroundColor: OVERVIEW_META.expenses.bg }]}>
              <Icon name={OVERVIEW_META.expenses.icon} size={16} color={OVERVIEW_META.expenses.fg} />
            </View>
            <View style={styles.overviewMain}>
              <Text style={styles.overviewLabel}>Expenses</Text>
              <Text style={styles.overviewValue}>{formatNPR(todaySummary.expenses)}</Text>
            </View>
            <ChangeLabel value={percentChange(todaySummary.expenses, yesterdaySummary.expenses)} invert />
          </View>
          <View style={[styles.overviewRow, { borderBottomWidth: 0 }]}>
            <View style={[styles.overviewIcon, { backgroundColor: OVERVIEW_META.net.bg }]}>
              <Icon name={OVERVIEW_META.net.icon} size={16} color={OVERVIEW_META.net.fg} />
            </View>
            <View style={styles.overviewMain}>
              <Text style={styles.overviewLabel}>Net Cash Flow</Text>
              <Text style={[styles.overviewValue, { color: todaySummary.net >= 0 ? colors.success : colors.red }]}>
                {formatNPR(todaySummary.net)}
              </Text>
            </View>
            <ChangeLabel value={percentChange(todaySummary.net, yesterdaySummary.net)} />
          </View>
        </Card>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.aiBanner}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("AIAssistant")}
            accessibilityRole="button"
            accessibilityLabel="Ask Orbit AI"
          >
            <View style={styles.aiBannerIcon}>
              <Icon name="message-circle" size={18} color={colors.white} />
            </View>
            <View style={styles.aiBannerText}>
              <Text style={styles.aiBannerTitle}>Ask Orbit AI</Text>
              <Text style={styles.aiBannerSubtitle}>Get answers about your cash flow, sales, and expenses</Text>
            </View>
            <Icon name="chevron-right" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <DisasterReliefBanner onPress={() => {}} />
        </View>

        <View style={styles.section}>
          <InsuranceBanner onPress={() => {}} />
        </View>

        {hasActivity ? (
          <View style={styles.section}>
            <InteractiveLineChart title="Cash Flow" subtitle="Last 30 days" series={chartSeries} />
          </View>
        ) : null}

        <View style={styles.section}>
          <SectionHeader
            title="Recent Transactions"
            actionLabel="View all"
            onAction={() => navigation.navigate("MainTabs", { screen: "Transactions" })}
          />
          {hasActivity ? (
            recent.map((t) => (
              <TransactionRow key={t.id} transaction={t} onPress={() => navigation.navigate("TransactionDetail", { transactionId: t.id })} />
            ))
          ) : (
            <EmptyState
              icon="inbox"
              title="No activity yet"
              description="Add a transaction to see your business activity here."
              ctaLabel="Add transaction"
              onPress={() => navigation.navigate("AddTransaction", {})}
            />
          )}
        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("MainTabs", { screen: "Insights" })}>
          <Card style={styles.insightsCta}>
            <Icon name="bar-chart-2" size={18} color={colors.brand} />
            <Text style={styles.insightsCtaLabel}>View Insights</Text>
            <Icon name="chevron-right" size={16} color={colors.textFaint} />
          </Card>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("MainTabs", { screen: "FinancialProfile" })}>
          <Card style={styles.profileCta}>
            <Icon name="file-text" size={18} color={colors.brand} />
            <View style={styles.profileCtaInfo}>
              <Text style={styles.insightsCtaLabel}>Your Financial Profile</Text>
              <Text style={styles.profileCtaSub}>Organized financial history, ready to share on your terms.</Text>
            </View>
            <Icon name="chevron-right" size={16} color={colors.textFaint} />
          </Card>
        </TouchableOpacity>

        <View style={styles.section}>
          <PaymentBannerSlider onPress={() => {}} />
        </View>

        <View style={styles.section}>
          <OffersCard onPress={() => {}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.brand },
  header: { backgroundColor: colors.brand, paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.lg },
  headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  greeting: { color: colors.white, fontSize: 20, fontWeight: "800", lineHeight: 26 },
  bellWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  scrollBg: { flex: 1, backgroundColor: colors.bg },
  scrollBody: { paddingTop: spacing.md, paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  overviewCard: { marginBottom: spacing.md },
  overviewHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xs },
  overviewDate: { fontSize: 12, color: colors.textFaint, fontWeight: "600" },
  overviewRow: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.sm + 2, borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.sm },
  overviewIcon: { width: 34, height: 34, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  overviewMain: { flex: 1 },
  overviewLabel: { fontSize: 13, color: colors.textMuted, fontWeight: "600" },
  aiBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    padding: spacing.sm + 4,
  },
  aiBannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  aiBannerText: { flex: 1 },
  aiBannerTitle: { color: colors.white, fontSize: 15, fontWeight: "800" },
  aiBannerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 },
  overviewValue: { fontSize: 20, fontWeight: "800", color: colors.text, marginTop: 2 },
  change: { fontSize: 12, fontWeight: "700" },
  section: { marginBottom: spacing.md },
  insightsCta: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  insightsCtaLabel: { flex: 1, fontSize: 14, fontWeight: "700", color: colors.text },
  profileCta: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md },
  profileCtaInfo: { flex: 1 },
  profileCtaSub: { fontSize: 12, color: colors.textFaint, marginTop: 2 },
});
