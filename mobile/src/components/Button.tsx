import React from "react";
import { ActivityIndicator, StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

import { colors, radius, touchTarget } from "@/theme";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Button({ label, onPress, variant = "primary", disabled, loading, style, accessibilityLabel }: Props) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={[styles.base, variantStyles[variant], isDisabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "secondary" || variant === "ghost" ? colors.brand : colors.white} />
      ) : (
        <Text style={[styles.label, textVariantStyles[variant]]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touchTarget + 8,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  label: { fontSize: 16, fontWeight: "700" },
  disabled: { opacity: 0.5 },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.brand },
  secondary: { backgroundColor: colors.brandLight },
  danger: { backgroundColor: colors.red },
  ghost: { backgroundColor: "transparent" },
});

const textVariantStyles = StyleSheet.create({
  primary: { color: colors.white },
  secondary: { color: colors.brand },
  danger: { color: colors.white },
  ghost: { color: colors.brand },
});
