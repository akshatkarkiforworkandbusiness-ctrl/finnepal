import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Header } from "@/components/Header";
import { ScreenContainer } from "@/components/ScreenContainer";
import { RootStackParamList } from "@/navigation/types";
import { colors, radius, spacing, typography } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "About">;

export function AboutScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <Header title="About Orbit" onBack={() => navigation.goBack()} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        <View style={styles.logoWrap}>
          <Image source={require("../../../assets/logos/logo.png")} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.statement}>
          "Your business activity is everywhere. Your financial operating layer should be in one place."
        </Text>

        <Text style={styles.body}>
          Orbit is a financial operating layer for small businesses in Nepal. It helps you collect, reconcile,
          categorize and understand your sales, expenses and cash flow — connect your accounting workflow through
          Tally, and build an organized, consent-shareable Financial Profile. Orbit does not replace Tally, and it
          is not a bank, wallet, or lender.
        </Text>

        <Text style={styles.version}>Version 1.0.0 (Prototype)</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Terms")} hitSlop={8} style={styles.termsLink}>
          <Text style={styles.termsLinkText}>Terms</Text>
        </TouchableOpacity>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, alignItems: "center" },
  logoWrap: {
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  logo: { width: 180, height: 180 / 2.459 },
  statement: { fontSize: 15, fontWeight: "700", color: colors.text, textAlign: "center", marginBottom: spacing.lg, lineHeight: 22 },
  body: { fontSize: 13, color: colors.textMuted, lineHeight: 20, textAlign: "center", marginBottom: spacing.lg },
  version: { fontSize: 12, color: colors.textFaint },
  termsLink: { marginTop: spacing.sm },
  termsLinkText: { fontSize: 13, fontWeight: "700", color: colors.brand },
});
