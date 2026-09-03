import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Badge } from "@/components/Badge";
import { EmptyState } from "@/components/EmptyState";
import { Icon } from "@/components/Icon";
import { TransactionRow } from "@/components/TransactionRow";
import { MainTabParamList, RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { TransactionChannel } from "@/types";
import { colors, radius, spacing } from "@/theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type TxRoute = RouteProp<MainTabParamList, "Transactions">;

const TABS = ["All", "Income", "Expense", "Pending"] as const;
const CHANNELS: (TransactionChannel | "All")[] = ["All", "Bank", "eSewa", "Khalti", "Cash", "Tally"];

export function TransactionsScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<TxRoute>();
  const { transactions } = useAppState();
  const [tab, setTab] = useState<(typeof TABS)[number]>(
    route.params?.initialFilter ? (route.params.initialFilter.charAt(0).toUpperCase() + route.params.initialFilter.slice(1)) as (typeof TABS)[number] : "All"
  );
  const [channel, setChannel] = useState<(typeof CHANNELS)[number]>("All");
  const [showFilters, setShowFilters] = useState(false);

  const sorted = useMemo(() => [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [transactions]);

  const filtered = useMemo(() => {
    return sorted.filter((t) => {
      if (tab === "Income" && t.type !== "income") return false;
      if (tab === "Expense" && t.type !== "expense") return false;
      if (tab === "Pending" && t.status !== "pending" && t.reconciliationStatus !== "pending") return false;
      if (channel !== "All" && t.channel !== channel) return false;
      return true;
    });
  }, [sorted, tab, channel]);

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Transactions</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Reconciliation")}
              style={styles.reconcileBtn}
              accessibilityRole="button"
              accessibilityLabel="Reconciliation"
            >
              <Icon name="layers" size={16} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("AddTransaction", {})}
              style={styles.addBtn}
              accessibilityRole="button"
              accessibilityLabel="Add transaction"
            >
              <Icon name="plus" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.tabRow}>
          <FlatList
            horizontal
            data={TABS}
            keyExtractor={(t) => t}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setTab(item)} style={styles.tabChip}>
                <View style={[styles.tabPill, tab === item && styles.tabPillActive]}>
                  <Text style={[styles.tabLabel, tab === item && styles.tabLabelActive]}>{item}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            onPress={() => setShowFilters((v) => !v)}
            style={[styles.filterBtn, showFilters && styles.filterBtnActive]}
            accessibilityRole="button"
            accessibilityLabel="Filter by channel"
          >
            <Icon name="grid" size={16} color={showFilters ? colors.white : colors.text} />
          </TouchableOpacity>
        </View>
        {showFilters ? (
          <FlatList
            horizontal
            data={CHANNELS}
            keyExtractor={(c) => c}
            showsHorizontalScrollIndicator={false}
            style={styles.channelRow}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setChannel(item)} style={styles.channelChip}>
                <Badge label={item} tone={channel === item ? "brand" : "neutral"} />
              </TouchableOpacity>
            )}
          />
        ) : null}
      </View>

      <FlatList
        style={styles.list}
        data={filtered}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          transactions.length === 0 ? (
            <EmptyState
              icon="inbox"
              title="No transactions yet"
              description="Add a transaction to start tracking your business activity."
              ctaLabel="Add transaction"
              onPress={() => navigation.navigate("AddTransaction", {})}
            />
          ) : (
            <EmptyState icon="search" title="No matching transactions" description="Try a different filter." />
          )
        }
        renderItem={({ item }) => (
          <TransactionRow transaction={item} onPress={() => navigation.navigate("TransactionDetail", { transactionId: item.id })} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: { backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.sm },
  headerTitle: { color: colors.text, fontSize: 22, fontWeight: "800" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  reconcileBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" },
  addBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.brand, alignItems: "center", justifyContent: "center" },
  tabRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  tabChip: { marginRight: spacing.xs },
  tabPill: { paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.bg },
  tabPillActive: { backgroundColor: colors.brand },
  tabLabel: { color: colors.textMuted, fontWeight: "700", fontSize: 13 },
  tabLabelActive: { color: colors.white },
  filterBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" },
  filterBtnActive: { backgroundColor: colors.brand },
  channelRow: { marginTop: spacing.sm },
  channelChip: { marginRight: spacing.xs },
  list: { flex: 1, backgroundColor: colors.bg },
  listContent: { padding: spacing.md, paddingBottom: spacing.xxl },
});
