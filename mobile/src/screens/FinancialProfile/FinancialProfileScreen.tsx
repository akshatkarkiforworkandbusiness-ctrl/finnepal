import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Icon } from "@/components/Icon";
import { SectionHeader } from "@/components/SectionHeader";
import { TALLY_SYNC } from "@/data/mockTallySync";
import { RootStackParamList } from "@/navigation/types";
import { reconciliationSummary } from "@/services/reconciliationService";
import { useAppState } from "@/state/AppContext";
import { colors, spacing, typography } from "@/theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function FinancialProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { transactions } = useAppState();
  const summary = useMemo(() => reconciliationSummary(transactions), [transactions]);

  const monthsOfHistory = useMemo(() => {
    if (transactions.length === 0) return 0;
    const oldest = transactions.reduce((min, t) => Math.min(min, new Date(t.date).getTime()), Date.now());
    return Math.floor((Date.now() - oldest) / (1000 * 60 * 60 * 24 * 30));
  }, [transactions]);

  const coverageStrength =
    monthsOfHistory >= 12 && summary.matchedPercent >= 80 && TALLY_SYNC.connected
      ? "Strong"
      : transactions.length > 0
        ? "Building"
        : "Getting Started";

  const indicators = [
    { label: "12 Months of Transactions", value: monthsOfHistory >= 12 ? "Complete" : `${monthsOfHistory} months` },
    { label: "Sales History", value: transactions.some((t) => t.type === "income") ? "Available" : "Not available" },
    { label: "Expense Records", value: transactions.some((t) => t.type === "expense") ? "Available" : "Not available" },
    { label: "Cash Flow History", value: transactions.length > 0 ? "Available" : "Not available" },
    { label: "Reconciliation", value: `${summary.matchedPercent}%` },
    { label: "Tally Connection", value: TALLY_SYNC.connected ? "Connected" : "Not connected" },
    { label: "Documents", value: "4 Available" },
  ];

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Profile</Text>
        <View style={styles.shieldWrap}>
          <Icon name="shield" size={18} color={colors.brand} />
        </View>
      </View>

      <ScrollView style={styles.scrollBg} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Card style={styles.healthCard}>
          <View style={styles.healthIconWrap}>
            <Icon name="shield" size={22} color={colors.brand} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={typography.label}>Business Financial Health</Text>
            <Text style={styles.healthValue}>{coverageStrength}</Text>
            <Text style={styles.cardSub}>
              {coverageStrength === "Strong"
                ? "You're on the right track!"
                : "Keep adding activity to build your profile."}
            </Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={typography.h3}>Business Financial Profile</Text>
          <Text style={styles.cardSub}>An organized, factual view of your financial history — not a credit score.</Text>

          {indicators.map((i, idx) => (
            <View key={i.label} style={[styles.row, idx === indicators.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={styles.rowLabel}>{i.label}</Text>
              <Text style={styles.rowValue}>{i.value}</Text>
            </View>
          ))}
        </Card>

        <TouchableOpacity onPress={() => navigation.navigate("TallyIntegration")} activeOpacity={0.8}>
          <Card style={styles.tallyCard}>
            <Icon name="sync" size={18} color={colors.brand} />
            <View style={{ flex: 1 }}>
              <Text style={styles.exploreLabel}>Tally Prime</Text>
              <Text style={styles.cardSub}>{TALLY_SYNC.connected ? `Connected · Last sync ${TALLY_SYNC.lastSync}` : "Not connected"}</Text>
            </View>
            <Icon name="chevron-right" size={16} color={colors.textFaint} />
          </Card>
        </TouchableOpacity>

        <Button label="Share Financial Profile" onPress={() => navigation.navigate("ShareConsent")} style={styles.shareBtn} />

        <View style={styles.section}>
          <SectionHeader title="Financial Services" />
          <Card style={styles.servicesCard}>
            <Text style={styles.servicesText}>
              Your organized financial history can help you prepare information for financial-service applications.
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Financing")} activeOpacity={0.8} style={styles.exploreRow}>
              <Icon name="briefcase" size={16} color={colors.brand} />
              <Text style={styles.exploreLabel}>Explore options</Text>
              <Icon name="chevron-right" size={16} color={colors.textFaint} />
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: colors.text, fontSize: 22, fontWeight: "800" },
  shieldWrap: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.brandLight, alignItems: "center", justifyContent: "center" },
  scrollBg: { flex: 1, backgroundColor: colors.bg },
  body: { paddingTop: spacing.md, paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  healthCard: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md },
  healthIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.brandLight, alignItems: "center", justifyContent: "center" },
  healthValue: { fontSize: 20, fontWeight: "800", color: colors.brand, marginTop: 2 },
  card: { marginBottom: spacing.md },
  cardSub: { fontSize: 12, color: colors.textMuted, marginTop: 4, marginBottom: spacing.sm, lineHeight: 17 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { fontSize: 13, color: colors.textMuted, flex: 1 },
  rowValue: { fontSize: 13, fontWeight: "800", color: colors.text },
  tallyCard: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  shareBtn: { marginBottom: spacing.lg },
  section: { marginBottom: spacing.md },
  servicesCard: {},
  servicesText: { fontSize: 13, color: colors.textMuted, lineHeight: 19, marginBottom: spacing.sm },
  exploreRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  exploreLabel: { flex: 1, fontSize: 14, fontWeight: "700", color: colors.text },
});
