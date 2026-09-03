import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { AccountConnectionCard, ConnectionCardStatus } from "@/components/AccountConnectionCard";
import { Header } from "@/components/Header";
import { BANK_CONNECTION_PROVIDER_IDS, PROVIDERS } from "@/data/mockAccounts";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, spacing } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "BankConnections">;

export function BankConnectionsScreen({ navigation }: Props) {
  const { connections } = useAppState();
  const connectedIds = new Set(connections.map((c) => c.provider));
  const items = BANK_CONNECTION_PROVIDER_IDS.map((id) => PROVIDERS.find((p) => p.id === id)!);

  return (
    <View style={styles.root}>
      <Header title="Bank & Wallet Connections" onBack={() => navigation.goBack()} />
      <FlatList
        data={items}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isConnected = connectedIds.has(item.id);
          const status: ConnectionCardStatus = isConnected ? "connected" : item.availability === "sandbox" ? "sandbox" : "connect";
          return (
            <AccountConnectionCard
              provider={item}
              status={status}
              onPress={() => navigation.navigate(isConnected ? "ManageConnection" : "ProviderAuth", { providerId: item.id })}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.md },
});
