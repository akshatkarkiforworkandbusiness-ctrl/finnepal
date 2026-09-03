import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { Icon } from "./Icon";
import { colors, spacing } from "@/theme";
import { TallySyncStep } from "@/types";

interface Props {
  steps: TallySyncStep[];
  activeIndex?: number;
}

export function SyncStatusCard({ steps, activeIndex = -1 }: Props) {
  return (
    <View>
      {steps.map((step, i) => {
        const isActive = i === activeIndex && !step.done;
        return (
          <View key={step.id} style={styles.row}>
            <View style={[styles.dot, step.done && styles.dotDone]}>
              {step.done ? (
                <Icon name="check" size={13} color={colors.white} />
              ) : isActive ? (
                <ActivityIndicator size="small" color={colors.brand} />
              ) : null}
            </View>
            {i < steps.length - 1 ? <View style={[styles.line, step.done && styles.lineDone]} /> : null}
            <Text style={[styles.label, (step.done || isActive) && styles.labelActive]}>{step.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", minHeight: 40 },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  dotDone: { backgroundColor: colors.success, borderColor: colors.success },
  line: { position: "absolute", left: 11.5, top: 24, width: 1, height: 16, backgroundColor: colors.border },
  lineDone: { backgroundColor: colors.success },
  label: { marginLeft: spacing.sm, fontSize: 14, color: colors.textMuted, fontWeight: "600" },
  labelActive: { color: colors.text, fontWeight: "700" },
});
