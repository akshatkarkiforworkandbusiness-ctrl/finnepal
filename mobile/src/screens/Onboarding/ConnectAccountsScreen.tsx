import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AccountConnectionCard, ConnectionCardStatus } from "@/components/AccountConnectionCard";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { ONBOARDING_PROVIDER_IDS, PROVIDERS } from "@/data/mockAccounts";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, radius, spacing } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "ConnectAccounts">;

export function ConnectAccountsScreen({ navigation }: Props) {
  const { connections, completeAccountsConnected } = useAppState();
  const connectedIds = new Set(connections.map((c) => c.provider));
  const items = ONBOARDING_PROVIDER_IDS.map((id) => PROVIDERS.find((p) => p.id === id)!);

  const finish = () => {
    completeAccountsConnected();
    navigation.replace("MainTabs");
  };

  return (
    <View style={styles.root}>
      <Header title="Connect Accounts" subtitle="Securely organize your banks, wallets and business tools." onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {items.map((p) => {
          const isConnected = connectedIds.has(p.id);
          const status: ConnectionCardStatus = isConnected ? "connected" : p.availability === "sandbox" ? "sandbox" : "connect";
          return (
            <AccountConnectionCard
              key={p.id}
              provider={p}
              status={status}
              description={p.description}
              onPress={() => navigation.navigate(isConnected ? "ManageConnection" : "ProviderAuth", { providerId: p.id })}
            />
          );
        })}

        <View style={styles.notice}>
          <Icon name="info" size={14} color={colors.brand} />
          <Text style={styles.noticeText}>Demo connections only. No real credentials are collected.</Text>
        </View>

        <Button label="Continue" onPress={finish} style={styles.cta} />
        <Button label="Skip for now" variant="ghost" onPress={finish} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  notice: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.brandLight,
    borderRadius: radius.md,
    padding: spacing.sm + 4,
    marginTop: spacing.sm,
  },
  noticeText: { flex: 1, fontSize: 12, color: colors.brand, lineHeight: 17 },
  cta: { marginTop: spacing.md },
});
