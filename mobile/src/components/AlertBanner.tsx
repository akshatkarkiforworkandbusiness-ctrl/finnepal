import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Button } from "./Button";
import { Icon } from "./Icon";
import { colors, radius, spacing } from "@/theme";

interface Props {
  title: string;
  message: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
}

export function AlertBanner({ title, message, primaryLabel, secondaryLabel, onPrimary, onSecondary }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Icon name="alert-triangle" size={18} color={colors.red} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.actions}>
        <Button label={secondaryLabel} variant="secondary" onPress={onSecondary} style={styles.flex} />
        <Button label={primaryLabel} variant="danger" onPress={onPrimary} style={styles.flex} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.redSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(197,22,29,0.25)",
    padding: spacing.md,
  },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs },
  title: { fontSize: 15, fontWeight: "800", color: colors.red },
  message: { fontSize: 13, color: "#7A1114", marginBottom: spacing.md, lineHeight: 18 },
  actions: { flexDirection: "row", gap: spacing.sm },
  flex: { flex: 1 },
});
