import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { PermissionRow } from "@/components/PermissionRow";
import { ProviderBadge } from "@/components/ProviderBadge";
import { ScreenContainer } from "@/components/ScreenContainer";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, spacing, typography } from "@/theme";
import { getProvider } from "@/utils/providers";

type Props = NativeStackScreenProps<RootStackParamList, "ManageConnection">;

export function ManageConnectionScreen({ navigation, route }: Props) {
  const provider = getProvider(route.params.providerId);
  const { connections, disconnectProvider } = useAppState();
  const connection = connections.find((c) => c.provider === provider.id);

  const disconnect = () => {
    Alert.alert(`Disconnect ${provider.name}?`, "Orbit will stop accessing this account's data.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Disconnect",
        style: "destructive",
        onPress: () => {
          disconnectProvider(provider.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <Header title="Manage connection" onBack={() => navigation.goBack()} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        <View style={styles.providerRow}>
          <ProviderBadge provider={provider} size={48} />
          <View>
            <Text style={styles.name}>{provider.name}</Text>
            <Text style={styles.meta}>Connected {connection?.connectedAt}</Text>
          </View>
        </View>

        <Card style={styles.card}>
          <Text style={typography.label}>Permissions</Text>
          <View style={{ marginTop: spacing.xs }}>
            {(connection?.permissions ?? []).map((p) => (
              <PermissionRow key={p} label={p} allowed />
            ))}
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Last synced</Text>
            <Text style={styles.rowValue}>{connection?.lastSynced}</Text>
          </View>
        </Card>

        <Button label="Disconnect provider" variant="danger" onPress={disconnect} style={styles.disconnect} />
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  providerRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.lg },
  name: { fontSize: 17, fontWeight: "800", color: colors.text },
  meta: { fontSize: 12, color: colors.textFaint, marginTop: 2 },
  card: { marginBottom: spacing.sm },
  row: { flexDirection: "row", justifyContent: "space-between" },
  rowLabel: { fontSize: 13, color: colors.textMuted },
  rowValue: { fontSize: 13, fontWeight: "700", color: colors.text },
  disconnect: { marginTop: spacing.md },
});
