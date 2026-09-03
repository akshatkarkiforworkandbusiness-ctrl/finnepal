import React, { useEffect, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

import { colors, radius } from "@/theme";

interface Props {
  width?: number | `${number}%`;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = "100%", height = 16, style }: Props) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius.sm, backgroundColor: colors.brandLight, opacity },
        style,
      ]}
    />
  );
}
