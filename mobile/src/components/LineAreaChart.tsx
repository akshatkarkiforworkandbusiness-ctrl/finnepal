import React, { useId } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Defs, Line, LinearGradient, Path, Stop } from "react-native-svg";

import { colors } from "@/theme";
import { formatNPR } from "@/utils/format";

export interface LinePoint {
  label: string;
  value: number;
}

interface Props {
  data: LinePoint[];
  height?: number;
  color?: string;
}

interface Point {
  x: number;
  y: number;
}

/** Catmull-Rom → cubic Bezier conversion, so the line reads as a smooth trend rather than a jagged zigzag. */
function smoothPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length < 3) return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

const GRID_LINES = 3;

export function LineAreaChart({ data, height = 140, color = colors.brand }: Props) {
  const gradientId = `areaFill-${useId()}`;
  const width = 300;
  const paddingX = 4;
  const values = data.map((d) => d.value);
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const stepX = data.length > 1 ? (width - paddingX * 2) / (data.length - 1) : 0;
  const toY = (v: number) => height - ((v - min) / range) * height;
  const points: Point[] = data.map((d, i) => ({ x: paddingX + i * stepX, y: toY(d.value) }));

  const linePath = smoothPath(points);
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const areaPath = lastPoint && firstPoint ? `${linePath} L ${lastPoint.x} ${height} L ${firstPoint.x} ${height} Z` : "";
  const zeroY = toY(0);

  const labelIndexes = data.length > 1 ? [0, Math.floor((data.length - 1) / 2), data.length - 1] : [0];

  return (
    <View>
      <View style={styles.axisRow}>
        <Text style={styles.axisLabel}>{formatNPR(max)}</Text>
        <Text style={styles.axisLabel}>{formatNPR(min)}</Text>
      </View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={0.28} />
            <Stop offset="1" stopColor={color} stopOpacity={0.02} />
          </LinearGradient>
        </Defs>
        {Array.from({ length: GRID_LINES }).map((_, i) => {
          const y = (height / (GRID_LINES + 1)) * (i + 1);
          return <Line key={i} x1={0} y1={y} x2={width} y2={y} stroke={colors.border} strokeWidth={1} />;
        })}
        {min < 0 && max > 0 ? <Line x1={0} y1={zeroY} x2={width} y2={zeroY} stroke={colors.textFaint} strokeWidth={1} /> : null}
        <Path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
        <Path d={linePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {lastPoint ? <Path d={`M ${lastPoint.x} ${lastPoint.y} l 0 0`} stroke={color} strokeWidth={7} strokeLinecap="round" /> : null}
      </Svg>
      <View style={styles.labelRow}>
        {data.map((d, i) => (
          <Text key={i} style={styles.xLabel}>
            {labelIndexes.includes(i) ? d.label : ""}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  axisRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  axisLabel: { fontSize: 10, color: colors.textFaint, fontWeight: "600" },
  labelRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  xLabel: { fontSize: 10, color: colors.textFaint, fontWeight: "600" },
});
