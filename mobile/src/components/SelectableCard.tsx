import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { Icon } from "./Icon";
import { colors, radius, spacing } from "@/theme";

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function SelectableCard({ label, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.card, selected && styles.cardSelected]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
      {selected ? <Icon name="check" size={16} color={colors.brand} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  cardSelected: { borderColor: colors.brand, backgroundColor: colors.brandLight },
  label: { fontSize: 15, fontWeight: "600", color: colors.text },
  labelSelected: { color: colors.brand },
});
