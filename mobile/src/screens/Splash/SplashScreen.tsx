import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { useAuth } from "@/context/AuthContext";
import { colors, spacing } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export function SplashScreen({ navigation }: Props) {
  const { businessSetupComplete, accountsConnected, loading } = useAppState();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, [opacity, scale]);

  useEffect(() => {
    if (loading || authLoading) return;
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        navigation.replace("Login");
      } else if (businessSetupComplete && accountsConnected) {
        navigation.replace("MainTabs");
      } else {
        navigation.replace("Welcome");
      }
    }, 1600);
    return () => clearTimeout(timer);
  }, [loading, authLoading, isAuthenticated, businessSetupComplete, accountsConnected, navigation]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.spacer} />
      <Animated.View style={[styles.content, { opacity, transform: [{ scale }] }]}>
        <Image source={require("../../../assets/logos/mark.png")} style={styles.logo} resizeMode="contain" />
        <Text style={styles.wordmark}>ORBIT</Text>
        <Text style={styles.tagline}>Your Business.{"\n"}Your Financial Orbit.</Text>
        <Text style={styles.subtext}>Track. Understand. Grow.</Text>
        <Text style={styles.nepaliLine}>कारोबार आजको, हिसाब भोलिको।</Text>
      </Animated.View>
      <View style={styles.bottomWrap}>
        <View style={styles.dotsRow}>
          <View style={[styles.dot, { backgroundColor: colors.red }]} />
          <View style={[styles.dot, { backgroundColor: "rgba(255,255,255,0.5)" }]} />
          <View style={[styles.dot, { backgroundColor: "rgba(255,255,255,0.5)" }]} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.brand, padding: spacing.xl },
  spacer: { flex: 1 },
  content: { alignItems: "center", justifyContent: "center" },
  logo: { width: 96, height: 96, marginBottom: spacing.md },
  wordmark: { color: colors.white, fontSize: 30, fontWeight: "800", letterSpacing: 4 },
  tagline: { color: "rgba(255,255,255,0.85)", fontSize: 16, fontWeight: "600", textAlign: "center", marginTop: spacing.md, lineHeight: 22 },
  subtext: { color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: "600", textAlign: "center", marginTop: spacing.sm, letterSpacing: 1 },
  nepaliLine: { color: "rgba(255,255,255,0.65)", fontSize: 13, fontWeight: "600", textAlign: "center", marginTop: spacing.md },
  bottomWrap: { flex: 1, justifyContent: "flex-end", alignItems: "center", paddingBottom: spacing.lg },
  dotsRow: { flexDirection: "row", gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
