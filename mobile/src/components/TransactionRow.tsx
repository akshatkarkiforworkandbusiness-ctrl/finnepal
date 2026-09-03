import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ProviderBadge } from "./ProviderBadge";
import { colors, radius, spacing } from "@/theme";
import { Transaction } from "@/types";
import { formatRelativeDay, formatSignedNPR } from "@/utils/format";
import { getProvider } from "@/utils/providers";

interface Props {
  transaction: Transaction;
  onPress?: () => void;
}

export function TransactionRow({ transaction, onPress }: Props) {
  const isIncome = transaction.type === "income";
  const provider = getProvider(transaction.provider);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.row}
      accessibilityRole="button"
      accessibilityLabel={`${transaction.description}, ${formatSignedNPR(transaction.amount, transaction.type)}`}
    >
      <View style={styles.iconWrap}>
        <ProviderBadge provider={provider} size={40} />
      </View>
      <View style={styles.middle}>
        <Text style={styles.desc} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {transaction.categoryName} · {transaction.channel} · {formatRelativeDay(transaction.date)}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isIncome ? colors.success : colors.red }]}>
          {formatSignedNPR(transaction.amount, transaction.type)}
        </Text>
        {transaction.status === "pending" ? <Text style={styles.pending}>Pending</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm + 4,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  iconWrap: { marginRight: spacing.sm },
  middle: { flex: 1, marginRight: spacing.sm },
  desc: { fontSize: 14, fontWeight: "600", color: colors.text },
  meta: { fontSize: 12, color: colors.textFaint, marginTop: 2 },
  right: { alignItems: "flex-end" },
  amount: { fontSize: 14, fontWeight: "800" },
  pending: { fontSize: 11, fontWeight: "700", color: colors.warning, marginTop: 2 },
});
