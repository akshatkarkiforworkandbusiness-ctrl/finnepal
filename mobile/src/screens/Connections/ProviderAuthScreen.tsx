import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { LoadingState } from "@/components/LoadingState";
import { PermissionRow } from "@/components/PermissionRow";
import { ProviderBadge } from "@/components/ProviderBadge";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, radius, spacing, typography } from "@/theme";
import { getProvider } from "@/utils/providers";

type Props = NativeStackScreenProps<RootStackParamList, "ProviderAuth">;

const ALLOWED = ["Transaction history", "Transaction amount", "Transaction date", "Transaction status"];
const NOT_ALLOWED = ["Password", "MPIN", "OTP", "Card CVV"];

export function ProviderAuthScreen({ navigation, route }: Props) {
  const provider = getProvider(route.params.providerId);
  const { connectProvider } = useAppState();
  const [phase, setPhase] = useState<"idle" | "authorizing" | "syncing">("idle");

  const continueSecurely = () => setPhase("authorizing");

  useEffect(() => {
    if (phase !== "authorizing") return;
    let cancelled = false;
    setTimeout(() => {
      if (!cancelled) setPhase("syncing");
    }, 1200);
    connectProvider(provider.id).then(() => {
      if (!cancelled) navigation.replace("ConnectionSuccess", { providerId: provider.id });
    });
    return () => {
      cancelled = true;
    };
  }, [phase, provider.id]);

  if (phase === "authorizing" || phase === "syncing") {
    return (
      <SafeAreaView style={styles.loadingRoot}>
        <LoadingState
          label={phase === "authorizing" ? `Connecting to ${provider.name}...` : "Finishing setup..."}
          sublabel={phase === "authorizing" ? "Simulated secure connection in progress." : "Demo connection only — no real credentials are collected."}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <View style={styles.providerRow}>
          <ProviderBadge provider={provider} size={48} />
          <Text style={styles.providerName}>Connect {provider.name}</Text>
        </View>

        <Text style={[typography.h2, styles.heading]}>Review permissions</Text>
        <Text style={styles.description}>Orbit will only access the information you approve.</Text>

        <View style={styles.permBlock}>
          {ALLOWED.map((p) => (
            <PermissionRow key={p} label={p} allowed />
          ))}
        </View>

        <Text style={[typography.label, styles.notAllowedLabel]}>Not allowed</Text>
        <View style={styles.permBlock}>
          {NOT_ALLOWED.map((p) => (
            <PermissionRow key={p} label={p} allowed={false} />
          ))}
        </View>

        <View style={styles.notice}>
          <Icon name="info" size={14} color={colors.brand} />
          <Text style={styles.noticeText}>
            Demo connection only. No real credentials are collected — Orbit never asks for passwords, MPINs, OTPs, or card details.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button label="Continue securely" onPress={continueSecurely} />
        <Button label="Cancel" variant="ghost" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, justifyContent: "space-between" },
  content: { padding: spacing.lg },
  providerRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.lg },
  providerName: { fontSize: 17, fontWeight: "800", color: colors.text },
  heading: { marginBottom: 4 },
  description: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.md },
  permBlock: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm + 4,
  },
  notAllowedLabel: { marginTop: spacing.md, marginBottom: spacing.xs },
  notice: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.brandLight,
    borderRadius: radius.md,
    padding: spacing.sm + 4,
    marginTop: spacing.md,
  },
  noticeText: { flex: 1, fontSize: 12, color: colors.brand, lineHeight: 17 },
  footer: { padding: spacing.lg, gap: spacing.xs },
  loadingRoot: { flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center", padding: spacing.xl },
});
