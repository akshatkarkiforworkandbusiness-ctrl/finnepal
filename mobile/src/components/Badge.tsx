import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius } from "@/theme";

type Tone = "brand" | "success" | "warning" | "danger" | "neutral";

interface Props {
  label: string;
  tone?: Tone;
}

const toneStyles: Record<Tone, { bg: string; fg: string }> = {
  brand: { bg: colors.brandLight, fg: colors.brand },
  success: { bg: colors.successSoft, fg: colors.success },
  warning: { bg: colors.warningSoft, fg: colors.warning },
  danger: { bg: colors.redSoft, fg: colors.red },
  neutral: { bg: "#F0EDE8", fg: colors.textMuted },
};

export function Badge({ label, tone = "brand" }: Props) {
  const t = toneStyles[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Text style={[styles.label, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, alignSelf: "flex-start" },
  label: { fontSize: 12, fontWeight: "700" },
});
