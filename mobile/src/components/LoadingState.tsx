import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/theme";

interface Props {
  label?: string;
  sublabel?: string;
}

export function LoadingState({ label = "Loading...", sublabel }: Props) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={colors.brand} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", padding: spacing.xl },
  label: { fontSize: 15, color: colors.text, marginTop: spacing.md, fontWeight: "700", textAlign: "center" },
  sublabel: { fontSize: 13, color: colors.textMuted, marginTop: 4, textAlign: "center" },
});
