import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Icon } from "@/components/Icon";
import { colors, radius, spacing } from "@/theme";

interface Props {
  onPress?: () => void;
}

export function DisasterReliefBanner({ onPress }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} accessibilityRole="button">
      <LinearGradient colors={[colors.brand, colors.brandDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.banner}>
        <View style={styles.decorRingOuter} />
        <View style={styles.decorRingInner} />

        <View style={styles.logoWrap}>
          <Image source={require("../../assets/logos/image.png")} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.label}>Contribute to the Prime Minister's Disaster Relief Fund</Text>

        <View style={styles.chevronWrap}>
          <Icon name="chevron-right" size={16} color={colors.brand} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.sm + 4,
    overflow: "hidden",
  },
  decorRingOuter: {
    position: "absolute",
    right: -30,
    top: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  decorRingInner: {
    position: "absolute",
    right: -10,
    bottom: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  logoWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logo: { width: 30, height: 30 },
  label: {
    flex: 1,
    color: colors.white,
    fontSize: 13.5,
    fontWeight: "800",
    lineHeight: 18,
  },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
