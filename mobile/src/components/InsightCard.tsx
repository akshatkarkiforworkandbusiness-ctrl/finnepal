import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "./Card";
import { colors, spacing, typography } from "@/theme";

interface Props {
  label: string;
  value: string;
  note?: string;
}

export function InsightCard({ label, value, note }: Props) {
  return (
    <Card style={styles.card}>
      <Text style={typography.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.sm },
  value: { fontSize: 20, fontWeight: "800", color: colors.text, marginTop: 4 },
  note: { fontSize: 12, color: colors.textMuted, marginTop: 4, lineHeight: 17 },
});
