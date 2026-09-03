import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Icon } from "@/components/Icon";
import { colors, radius, spacing } from "@/theme";

interface Props {
  onPress?: () => void;
}

export function InsuranceBanner({ onPress }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} accessibilityRole="button">
      <LinearGradient colors={["#0B2545", "#071A33"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.banner}>
        <View style={styles.decorCircle} />
        <View style={styles.decorIcon}>
          <Icon name="shield" size={110} color="rgba(255,255,255,0.06)" />
        </View>

        <View style={styles.badge}>
          <View style={styles.badgeIconWrap}>
            <Image source={require("../../assets/logos/mark.png")} style={styles.badgeIcon} resizeMode="contain" />
          </View>
          <Text style={styles.badgeText}>Sahara Health Insurance</Text>
        </View>

        <View style={styles.copyWrap}>
          <Text style={styles.quote}>'जरैको आँट हैन'</Text>
          <Text style={styles.headline}>गरिहाल्नुस्!</Text>
        </View>

        <View style={styles.chevronWrap}>
          <Icon name="chevron-right" size={16} color="#0B2545" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: radius.lg,
    padding: spacing.sm + 4,
    minHeight: 96,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  decorCircle: {
    position: "absolute",
    right: -36,
    bottom: -46,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  decorIcon: { position: "absolute", right: -10, bottom: -20 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  badgeIconWrap: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  badgeIcon: { width: 14, height: 14 },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: "700" },
  copyWrap: { marginTop: spacing.sm },
  quote: { color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: "600" },
  headline: { color: colors.white, fontSize: 22, fontWeight: "800", marginTop: 2 },
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
});
