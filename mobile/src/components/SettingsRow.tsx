import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Icon, IconName } from "./Icon";
import { colors, spacing } from "@/theme";

interface Props {
  icon: IconName;
  label: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
  destructive?: boolean;
}

export function SettingsRow({ icon, label, subtitle, value, onPress, isLast, destructive }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.row, isLast && { borderBottomWidth: 0 }]}
      activeOpacity={0.7}
      accessibilityRole="button"
    >
      <Icon name={icon} size={17} color={destructive ? colors.red : colors.brand} />
      <View style={styles.labelWrap}>
        <Text style={[styles.label, destructive && { color: colors.red }]}>{label}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      <Icon name="chevron-right" size={16} color={colors.textFaint} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 48,
  },
  labelWrap: { flex: 1 },
  label: { fontSize: 14, fontWeight: "600", color: colors.text },
  subtitle: { fontSize: 12, color: colors.textFaint, marginTop: 2 },
  value: { fontSize: 13, color: colors.textFaint, marginRight: 2 },
});
