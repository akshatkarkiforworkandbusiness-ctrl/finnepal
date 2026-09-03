import React from "react";
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from "react-native";

import { colors, radius, spacing } from "@/theme";

interface Props {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export function FormField({ label, value, onChangeText, placeholder, error, keyboardType, multiline, autoCapitalize = "sentences" }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        keyboardType={keyboardType}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        accessibilityLabel={label}
        style={[styles.input, multiline && styles.multiline, error && styles.inputError]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: "700", color: colors.textMuted, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    minHeight: 48,
  },
  multiline: { minHeight: 88, textAlignVertical: "top" },
  inputError: { borderColor: colors.red },
  error: { fontSize: 12, color: colors.red, marginTop: 4, fontWeight: "600" },
});
