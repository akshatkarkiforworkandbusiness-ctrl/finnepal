import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, radius, spacing } from "@/theme";

interface Props {
  onPress?: () => void;
}

export function HisabKhataBanner({ onPress }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} accessibilityRole="button" style={styles.banner}>
      <View style={styles.textWrap}>
        <Text style={styles.caption}>पसलमा QR छ, हिसाब अझै खातामा?</Text>
        <Text style={styles.sub}>अब Orbit मा राख्नुहोस्!</Text>
      </View>

      <View style={styles.thumbWrap}>
        <Image source={require("../../assets/banners/orbit-hisab-khata.png")} style={styles.thumb} resizeMode="cover" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: colors.brand,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: spacing.md,
    overflow: "hidden",
  },
  textWrap: { flex: 1, paddingRight: spacing.sm },
  caption: { color: colors.white, fontSize: 13, fontWeight: "800", lineHeight: 17 },
  sub: { color: colors.brandSoft, fontSize: 11, fontWeight: "600", marginTop: 2 },
  thumbWrap: { width: 72, height: "100%" },
  thumb: { width: "100%", height: "100%" },
});
