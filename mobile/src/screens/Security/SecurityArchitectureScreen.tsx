import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Header } from "@/components/Header";
import { Icon, IconName } from "@/components/Icon";
import { ScreenContainer } from "@/components/ScreenContainer";
import { RootStackParamList } from "@/navigation/types";
import { colors, radius, spacing, typography } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "SecurityArchitecture">;

const STEPS: { icon: IconName; label: string }[] = [
  { icon: "link", label: "You choose a provider" },
  { icon: "eye", label: "You review permissions" },
  { icon: "check-circle", label: "Provider authorizes access" },
  { icon: "download", label: "Orbit receives permitted data" },
  { icon: "unlock", label: "You can revoke access anytime" },
];

export function SecurityArchitectureScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <Header title="Built around your consent" onBack={() => navigation.goBack()} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        <View style={styles.iconWrap}>
          <Icon name="shield" size={28} color={colors.brand} />
        </View>
        <Text style={[typography.h2, styles.title]}>How your data flows</Text>

        {STEPS.map((s, i) => (
          <View key={s.label} style={styles.stepRow}>
            <View style={styles.stepIconCol}>
              <View style={styles.stepIcon}>
                <Icon name={s.icon} size={16} color={colors.brand} />
              </View>
              {i < STEPS.length - 1 ? <View style={styles.connector} /> : null}
            </View>
            <Text style={styles.stepLabel}>{s.label}</Text>
          </View>
        ))}

        <View style={styles.notice}>
          <Text style={styles.noticeText}>Orbit does not need your banking password or wallet MPIN.</Text>
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brandLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: { marginBottom: spacing.lg },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  stepIconCol: { alignItems: "center" },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.brandLight,
    alignItems: "center",
    justifyContent: "center",
  },
  connector: { width: 2, height: 28, backgroundColor: colors.border },
  stepLabel: { fontSize: 14, fontWeight: "700", color: colors.text, paddingTop: 8, flex: 1 },
  notice: { backgroundColor: colors.brandLight, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  noticeText: { fontSize: 13, color: colors.brand, fontWeight: "600", textAlign: "center" },
});
