import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { colors, radius, spacing } from "@/theme";

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}

export function Card({ children, style, padded = true }: Props) {
  return <View style={[styles.card, padded && styles.padded, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.brand,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  padded: { padding: spacing.md },
});
