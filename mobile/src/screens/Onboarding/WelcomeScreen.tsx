import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Dimensions, Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, radius, spacing } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const CAROUSEL_HEIGHT = Math.round(SCREEN_HEIGHT * 0.56);

const SLIDES = [
  require("../../../assets/splash screen 1.png"),
  require("../../../assets/splash screen 2.png"),
  require("../../../assets/splash screen 3.png"),
];

export function WelcomeScreen({ navigation }: Props) {
  const { completeBusinessSetup, completeAccountsConnected } = useAppState();
  const [index, setIndex] = useState(0);

  const getStarted = () => navigation.navigate("BusinessType");

  const skipToExisting = () => {
    completeBusinessSetup();
    completeAccountsConnected();
    navigation.replace("MainTabs");
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setIndex(next);
  };

  return (
    <View style={styles.root}>
      <View style={styles.carouselWrap}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
        >
          {SLIDES.map((source, i) => (
            <Image key={i} source={source} style={styles.slide} resizeMode="cover" />
          ))}
        </ScrollView>

        <SafeAreaView edges={["top"]} style={styles.skipWrap} pointerEvents="box-none">
          <TouchableOpacity onPress={skipToExisting} hitSlop={10} style={styles.skipBtn}>
            <Text style={styles.skipLabel}>Skip</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <SafeAreaView edges={["bottom"]} style={styles.sheet}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        <Text style={styles.title}>Welcome to Orbit</Text>
        <Text style={styles.subtitle}>All your business finances, organized in one simple view.</Text>

        <Button label="Get Started" onPress={getStarted} style={styles.cta} />
        <Button label="I already have an account" variant="secondary" onPress={skipToExisting} />
        <Text style={styles.legal}>By continuing you agree to Orbit's Terms of Service and Privacy commitments.</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  carouselWrap: { height: CAROUSEL_HEIGHT, backgroundColor: colors.brand },
  skipWrap: { position: "absolute", top: 0, right: 0, left: 0 },
  skipBtn: { alignSelf: "flex-end", paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  skipLabel: { color: colors.white, fontSize: 14, fontWeight: "700", textShadowColor: "rgba(0,0,0,0.35)", textShadowRadius: 4, textShadowOffset: { width: 0, height: 1 } },
  slide: { width: SCREEN_WIDTH, height: CAROUSEL_HEIGHT },
  sheet: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    marginTop: -radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    shadowColor: colors.brand,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  dotsRow: { flexDirection: "row", justifyContent: "center", gap: 6, marginBottom: spacing.md },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.brand, width: 18 },
  title: { fontSize: 20, fontWeight: "800", color: colors.text, textAlign: "center" },
  subtitle: { color: colors.textMuted, textAlign: "center", fontSize: 13, lineHeight: 19, marginTop: 6, marginBottom: spacing.md },
  cta: { marginBottom: spacing.xs },
  legal: { color: colors.textFaint, fontSize: 11, textAlign: "center", marginTop: spacing.sm, marginBottom: spacing.sm, lineHeight: 16 },
});
