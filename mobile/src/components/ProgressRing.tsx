import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { colors } from "@/theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
}

export function ProgressRing({
  value,
  max = 100,
  size = 96,
  strokeWidth = 10,
  color = colors.brand,
  trackColor = colors.brandLight,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = useRef(new Animated.Value(0)).current;
  const fraction = Math.max(0, Math.min(1, value / max));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: fraction,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [fraction, progress]);

  const strokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
    </View>
  );
}
