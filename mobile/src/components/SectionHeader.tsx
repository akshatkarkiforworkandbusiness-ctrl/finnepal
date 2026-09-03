import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, spacing, typography } from "@/theme";

interface Props {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: Props) {
  return (
    <View style={styles.row}>
      <Text style={typography.h3}>{title}</Text>
      {actionLabel ? (
        <TouchableOpacity onPress={onAction} accessibilityRole="button" hitSlop={8}>
          <Text style={styles.action}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.sm },
  action: { color: colors.red, fontWeight: "700", fontSize: 13 },
});
