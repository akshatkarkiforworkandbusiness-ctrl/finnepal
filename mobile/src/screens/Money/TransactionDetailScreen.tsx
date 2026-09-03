import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { ScreenContainer } from "@/components/ScreenContainer";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, spacing, typography } from "@/theme";
import { formatDate, formatSignedNPR, formatTime } from "@/utils/format";

type Props = NativeStackScreenProps<RootStackParamList, "TransactionDetail">;

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const RECON_LABEL: Record<string, string> = { matched: "Matched", pending: "Pending", mismatched: "Needs review" };
const TALLY_LABEL: Record<string, string> = { synced: "Synced", pending: "Pending", not_synced: "Not synced" };

export function TransactionDetailScreen({ navigation, route }: Props) {
  const { transactions, markReconciled } = useAppState();
  const tx = transactions.find((t) => t.id === route.params.transactionId);
  if (!tx) return null;
  const isIncome = tx.type === "income";

  return (
    <View style={styles.root}>
      <Header title="Transaction detail" onBack={() => navigation.goBack()} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        <View style={styles.amountBlock}>
          <Text style={[styles.amount, { color: isIncome ? colors.success : colors.red }]}>
            {formatSignedNPR(tx.amount, tx.type)}
          </Text>
          <Text style={styles.desc}>{tx.description}</Text>
        </View>

        <Card>
          <Row label="Transaction ID" value={tx.reference} />
          <Row label="Type" value={isIncome ? "Income" : "Expense"} />
          <Row label="Category" value={tx.categoryName} />
          <Row label="Channel" value={tx.channel} />
          <Row label="Customer" value={tx.customerName ?? "—"} />
          <Row label="Date" value={formatDate(tx.date)} />
          <Row label="Time" value={formatTime(tx.date)} />
        </Card>

        <View style={styles.statusRow}>
          <Card style={styles.statusCard}>
            <Text style={typography.label}>Reconciliation</Text>
            <Badge
              label={RECON_LABEL[tx.reconciliationStatus]}
              tone={tx.reconciliationStatus === "matched" ? "success" : tx.reconciliationStatus === "pending" ? "warning" : "danger"}
            />
          </Card>
          <Card style={styles.statusCard}>
            <Text style={typography.label}>Tally</Text>
            <Badge label={TALLY_LABEL[tx.tallyStatus]} tone={tx.tallyStatus === "synced" ? "success" : "warning"} />
          </Card>
        </View>

        {tx.note ? (
          <>
            <Text style={styles.notesLabel}>Note</Text>
            <Text style={styles.notes}>{tx.note}</Text>
          </>
        ) : null}

        <View style={styles.actions}>
          <Button
            label="Edit"
            variant="secondary"
            onPress={() => navigation.navigate("AddTransaction", { editId: tx.id })}
            style={styles.actionBtn}
          />
          {tx.reconciliationStatus !== "matched" ? (
            <Button
              label="Mark reconciled"
              variant="secondary"
              onPress={() => markReconciled(tx.id)}
              style={styles.actionBtn}
            />
          ) : null}
          <Button
            label="View accounting record"
            variant="ghost"
            onPress={() => Alert.alert("Accounting record", "In a full integration this would open the matching Tally voucher.")}
            style={styles.actionBtn}
          />
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  amountBlock: { alignItems: "center", marginBottom: spacing.lg },
  amount: { fontSize: 32, fontWeight: "800" },
  desc: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: { fontSize: 13, color: colors.textMuted },
  rowValue: { fontSize: 13, fontWeight: "700", color: colors.text },
  statusRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  statusCard: { flex: 1, gap: 6 },
  notesLabel: { ...typography.label, marginTop: spacing.lg, marginBottom: spacing.xs },
  notes: { fontSize: 13, color: colors.text },
  actions: { marginTop: spacing.lg },
  actionBtn: { marginBottom: spacing.sm },
});
