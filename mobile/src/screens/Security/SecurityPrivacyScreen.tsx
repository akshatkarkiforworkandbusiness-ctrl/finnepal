import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { ScreenContainer } from "@/components/ScreenContainer";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, spacing, typography } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "SecurityPrivacy">;

export function SecurityPrivacyScreen({ navigation }: Props) {
  const { connections, consentGrants, transactions } = useAppState();
  const activePermissions = useMemo(() => Object.values(consentGrants).filter((g) => g.granted).length, [consentGrants]);
  const hasFlagged = transactions.some((t) => t.status === "flagged");

  const signOutAll = () => {
    Alert.alert("Sign out all devices", "Signed out of all other active sessions.", [{ text: "OK" }]);
  };

  return (
    <View style={styles.root}>
      <Header title="Security & Privacy" onBack={() => navigation.goBack()} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        <View style={styles.statsGrid}>
          <Card style={styles.statTile}>
            <Icon name="shield" size={18} color={colors.brand} />
            <Text style={styles.statValue}>Secure</Text>
            <Text style={styles.statLabel}>Your data</Text>
          </Card>
          <Card style={styles.statTile}>
            <Icon name="link" size={18} color={colors.brand} />
            <Text style={styles.statValue}>{connections.length}</Text>
            <Text style={styles.statLabel}>Connected accounts</Text>
          </Card>
          <Card style={styles.statTile}>
            <Icon name="smartphone" size={18} color={colors.brand} />
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Active sessions</Text>
          </Card>
          <Card style={styles.statTile}>
            <Icon name="share-2" size={18} color={colors.brand} />
            <Text style={styles.statValue}>{activePermissions}</Text>
            <Text style={styles.statLabel}>Data sharing</Text>
          </Card>
        </View>

        {hasFlagged ? (
          <TouchableOpacity onPress={() => navigation.navigate("FraudAlert")} activeOpacity={0.85}>
            <Card style={styles.alertCard}>
              <Icon name="alert-triangle" size={18} color={colors.red} />
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitle}>1 alert needs your review</Text>
                <Text style={styles.alertMeta}>Tap to review the flagged transaction</Text>
              </View>
              <Icon name="chevron-right" size={18} color={colors.red} />
            </Card>
          </TouchableOpacity>
        ) : null}

        <Card style={styles.explainCard}>
          <Text style={typography.h3}>Your data is protected</Text>
          <Text style={styles.explainText}>
            Orbit never asks for your bank password, wallet PIN or OTP in this prototype.
          </Text>
        </Card>

        <Button label="Manage permissions" variant="secondary" onPress={() => navigation.navigate("BankConnections")} style={styles.action} />
        <Button label="View activity" variant="secondary" onPress={() => navigation.navigate("ActivityLog")} style={styles.action} />
        <Button label="Sign out all devices" variant="danger" onPress={signOutAll} style={styles.action} />

        <TouchableOpacity onPress={() => navigation.navigate("SecurityArchitecture")} style={styles.architectureLink}>
          <Icon name="lock" size={14} color={colors.brand} />
          <Text style={styles.architectureText}>How Orbit is built around your consent</Text>
          <Icon name="chevron-right" size={14} color={colors.brand} />
        </TouchableOpacity>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md },
  statTile: { flexBasis: "47%", alignItems: "center", gap: 4 },
  statValue: { fontSize: 18, fontWeight: "800", color: colors.text },
  statLabel: { fontSize: 11, color: colors.textMuted, textAlign: "center" },
  alertCard: { flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.redSoft, borderColor: "rgba(197,22,29,0.25)", marginBottom: spacing.md },
  alertTitle: { fontSize: 14, fontWeight: "800", color: colors.red },
  alertMeta: { fontSize: 12, color: "#7A1114", marginTop: 2 },
  explainCard: { marginBottom: spacing.md },
  explainText: { fontSize: 13, color: colors.textMuted, marginTop: 6, lineHeight: 18 },
  action: { marginBottom: spacing.sm },
  architectureLink: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: spacing.md, justifyContent: "center" },
  architectureText: { fontSize: 13, fontWeight: "700", color: colors.brand },
});
