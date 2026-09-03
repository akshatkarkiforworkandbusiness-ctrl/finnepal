import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, ImageBackground, LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Icon } from "@/components/Icon";
import { colors, radius, spacing } from "@/theme";

interface Slide {
  key: string;
  image: number;
  logo: number;
  badgeText: string;
  badgeColor: string;
  caption: string;
}

const SLIDES: Slide[] = [
  {
    key: "esewa",
    image: require("../../assets/banners/esewa-scan-pay.png"),
    logo: require("../../assets/logos/esewa.png"),
    badgeText: "eSewa",
    badgeColor: "#0A8F44",
    caption: "Scan & pay with eSewa, no cash needed",
  },
  {
    key: "khalti",
    image: require("../../assets/banners/khalti-scan-pay.png"),
    logo: require("../../assets/logos/khalti.png"),
    badgeText: "Khalti",
    badgeColor: "#5C2D91",
    caption: "Bhukani sajilo chha! Scan & pay with Khalti",
  },
];

const SLIDE_INTERVAL_MS = 4000;

interface Props {
  onPress?: (slideKey: string) => void;
}

export function PaymentBannerSlider({ onPress }: Props) {
  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!width) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [width]);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: -activeIndex * width,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [activeIndex, width, translateX]);

  function handleLayout(e: LayoutChangeEvent) {
    setWidth(e.nativeEvent.layout.width);
  }

  return (
    <View style={styles.wrap} onLayout={handleLayout}>
      {width > 0 ? (
        <Animated.View style={[styles.track, { width: width * SLIDES.length, transform: [{ translateX }] }]}>
          {SLIDES.map((slide) => (
            <TouchableOpacity
              key={slide.key}
              activeOpacity={0.85}
              onPress={() => onPress?.(slide.key)}
              style={{ width }}
              accessibilityRole="button"
            >
              <ImageBackground source={slide.image} style={styles.banner} imageStyle={styles.image}>
                <View style={styles.badge}>
                  <View style={styles.badgeIconWrap}>
                    <Image source={slide.logo} style={styles.badgeIcon} resizeMode="contain" />
                  </View>
                  <Text style={[styles.badgeText, { color: slide.badgeColor }]}>{slide.badgeText}</Text>
                </View>

                <View style={styles.chevronWrap}>
                  <Icon name="chevron-right" size={16} color={slide.badgeColor} />
                </View>

                <LinearGradient colors={["transparent", "rgba(0,0,0,0.6)"]} style={styles.scrim} />

                <Text style={styles.caption}>{slide.caption}</Text>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </Animated.View>
      ) : null}

      <View style={styles.dots}>
        {SLIDES.map((slide, i) => (
          <View key={slide.key} style={[styles.dot, i === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radius.lg, overflow: "hidden" },
  track: { flexDirection: "row" },
  banner: {
    height: 150,
    justifyContent: "flex-end",
    padding: spacing.sm + 4,
  },
  image: { resizeMode: "cover" },
  scrim: { position: "absolute", left: 0, right: 0, bottom: 0, height: 70 },
  badge: {
    position: "absolute",
    top: spacing.sm + 4,
    left: spacing.sm + 4,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  badgeIconWrap: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeIcon: { width: 16, height: 16 },
  badgeText: { fontSize: 11, fontWeight: "800" },
  caption: { color: colors.white, fontSize: 13, fontWeight: "700", paddingRight: 36, marginTop: spacing.sm },
  chevronWrap: {
    position: "absolute",
    right: spacing.sm + 4,
    top: spacing.sm + 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  dots: {
    marginTop: spacing.xs,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.5)" },
  dotActive: { backgroundColor: colors.white, width: 14 },
});
