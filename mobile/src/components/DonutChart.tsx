import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { colors } from "@/theme";

export interface DonutSlice {
  label: string;
  amount: number;
  color: string;
}

interface Props {
  data: DonutSlice[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ data, size = 168, strokeWidth = 22, centerLabel, centerValue }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((s, d) => s + d.amount, 0);

  let offsetSoFar = 0;
  const segments = data
    .filter((d) => d.amount > 0)
    .map((d) => {
      const fraction = total > 0 ? d.amount / total : 0;
      const dash = fraction * circumference;
      const segment = { ...d, dash, offset: offsetSoFar };
      offsetSoFar += dash;
      return segment;
    });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={colors.border} strokeWidth={strokeWidth} fill="none" />
        {segments.map((s, i) => (
          <Circle
            key={`${s.label}-${i}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={s.color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            strokeDashoffset={-s.offset}
            strokeLinecap="butt"
            rotation={-90}
            origin={`${size / 2}, ${size / 2}`}
          />
        ))}
      </Svg>
      {centerValue ? (
        <View style={[StyleSheet.absoluteFill, styles.center]}>
          {centerLabel ? <Text style={styles.centerLabel}>{centerLabel}</Text> : null}
          <Text style={styles.centerValue}>{centerValue}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center" },
  centerLabel: { fontSize: 11, color: colors.textMuted, fontWeight: "600" },
  centerValue: { fontSize: 15, color: colors.text, fontWeight: "800", marginTop: 2 },
});
