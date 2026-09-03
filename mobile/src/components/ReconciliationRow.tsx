import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Badge } from "./Badge";
import { colors, radius, spacing } from "@/theme";
import { ReconciliationStatus } from "@/types";
import { formatDate, formatNPR } from "@/utils/format";

const STATUS_META: Record<ReconciliationStatus, { label: string; tone: "success" | "warning" | "danger"; action: string }> = {
  matched: { label: "Matched", tone: "success", action: "View" },
  pending: { label: "Pending", tone: "warning", action: "Match" },
  mismatched: { label: "Needs Review", tone: "danger", action: "Review" },
};

interface Props {
  label: string;
  date: string;
  orbitAmount: number;
  tallyAmount?: number;
  status: ReconciliationStatus;
  onPress?: () => void;
}

export function ReconciliationRow({ label, date, orbitAmount, tallyAmount, status, onPress }: Props) {
  const meta = STATUS_META[status];
  const hasDifference = status === "mismatched" && tallyAmount !== undefined;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={styles.card} accessibilityRole="button">
      <View style={styles.topRow}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <Badge label={meta.label} tone={meta.tone} />
      </View>
      <Text style={styles.date}>{formatDate(date)}</Text>

      {tallyAmount === undefined ? (
        <Text style={styles.amount}>{formatNPR(orbitAmount)}</Text>
      ) : (
        <View style={styles.amountsRow}>
          <View style={styles.amountCol}>
            <Text style={styles.amountLabel}>Orbit</Text>
            <Text style={styles.amount}>{formatNPR(orbitAmount)}</Text>
          </View>
          <View style={styles.amountCol}>
            <Text style={styles.amountLabel}>Tally</Text>
            <Text style={styles.amount}>{formatNPR(tallyAmount)}</Text>
          </View>
        </View>
      )}

      {hasDifference ? <Text style={styles.diff}>Difference: {formatNPR(Math.abs(orbitAmount - tallyAmount!))}</Text> : null}

      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.actionBtn}>
        <Text style={styles.actionLabel}>{meta.action}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm + 4,
    marginBottom: spacing.sm,
  },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  label: { flex: 1, fontSize: 14, fontWeight: "700", color: colors.text },
  date: { fontSize: 12, color: colors.textFaint, marginTop: 2 },
  amount: { fontSize: 16, fontWeight: "800", color: colors.text, marginTop: 6 },
  amountsRow: { flexDirection: "row", gap: spacing.lg, marginTop: 6 },
  amountCol: {},
  amountLabel: { fontSize: 11, color: colors.textMuted, fontWeight: "600" },
  diff: { fontSize: 12, fontWeight: "700", color: colors.red, marginTop: 4 },
  actionBtn: { alignSelf: "flex-start", marginTop: spacing.sm },
  actionLabel: { fontSize: 13, fontWeight: "700", color: colors.brand },
});
