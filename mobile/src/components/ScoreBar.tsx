import React from "react";
import { StyleSheet, View } from "react-native";

import { colors, radius } from "@/theme";

interface Props {
  value: number;
  max?: number;
  color?: string;
  height?: number;
}

export function ScoreBar({ value, max = 100, color = colors.brand, height = 6 }: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color, borderRadius: height / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: "100%", backgroundColor: colors.brandLight, overflow: "hidden" },
  fill: { height: "100%" },
});
