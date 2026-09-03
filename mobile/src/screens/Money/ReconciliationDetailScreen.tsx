import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { ScreenContainer } from "@/components/ScreenContainer";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, spacing, typography } from "@/theme";
import { formatDate, formatNPR } from "@/utils/format";

type Props = NativeStackScreenProps<RootStackParamList, "ReconciliationDetail">;

const STATUS_META = {
  matched: { label: "Matched", tone: "success" as const },
  pending: { label: "Pending", tone: "warning" as const },
  mismatched: { label: "Needs Review", tone: "danger" as const },
};

export function ReconciliationDetailScreen({ navigation, route }: Props) {
  const { transactions, markReconciled } = useAppState();
  const tx = transactions.find((t) => t.id === route.params.transactionId);
  if (!tx) return null;
  const meta = STATUS_META[tx.reconciliationStatus];

  return (
    <View style={styles.root}>
      <Header title="Reconciliation Detail" onBack={() => navigation.goBack()} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        <View style={styles.titleBlock}>
          <Text style={styles.desc}>{tx.description}</Text>
          <Text style={styles.date}>{formatDate(tx.date)}</Text>
          <Badge label={meta.label} tone={meta.tone} />
        </View>

        <Card style={styles.compareCard}>
          <View style={styles.compareCol}>
            <Text style={typography.label}>Orbit</Text>
            <Text style={styles.amount}>{formatNPR(tx.amount)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.compareCol}>
            <Text style={typography.label}>Tally</Text>
            <Text style={styles.amount}>{tx.tallyAmount !== undefined ? formatNPR(tx.tallyAmount) : "—"}</Text>
          </View>
        </Card>

        {tx.reconciliationStatus === "mismatched" && tx.tallyAmount !== undefined ? (
          <Card style={styles.diffCard}>
            <Text style={styles.diffLabel}>Difference</Text>
            <Text style={styles.diffValue}>{formatNPR(Math.abs(tx.amount - tx.tallyAmount))}</Text>
            <Text style={styles.diffNote}>
              This difference needs manual review in your accounting records. Orbit never changes a mismatched amount
              automatically.
            </Text>
          </Card>
        ) : null}

        {tx.reconciliationStatus === "pending" ? (
          <Button label="Mark as Matched" onPress={() => markReconciled(tx.id)} style={styles.action} />
        ) : null}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  titleBlock: { alignItems: "center", marginBottom: spacing.lg, gap: 6 },
  desc: { fontSize: 17, fontWeight: "800", color: colors.text, textAlign: "center" },
  date: { fontSize: 13, color: colors.textFaint },
  compareCard: { flexDirection: "row", alignItems: "center" },
  compareCol: { flex: 1, alignItems: "center" },
  divider: { width: 1, height: 40, backgroundColor: colors.border },
  amount: { fontSize: 20, fontWeight: "800", color: colors.text, marginTop: 4 },
  diffCard: { marginTop: spacing.md, backgroundColor: colors.redSoft, borderColor: "rgba(197,22,29,0.25)" },
  diffLabel: { fontSize: 12, color: colors.red, fontWeight: "700" },
  diffValue: { fontSize: 20, fontWeight: "800", color: colors.red, marginTop: 2 },
  diffNote: { fontSize: 12, color: "#7A1114", marginTop: spacing.sm, lineHeight: 17 },
  action: { marginTop: spacing.lg },
});
