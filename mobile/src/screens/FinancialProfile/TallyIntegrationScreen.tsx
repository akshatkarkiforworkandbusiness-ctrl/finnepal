import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SectionHeader } from "@/components/SectionHeader";
import { TALLY_SYNC } from "@/data/mockTallySync";
import { RootStackParamList } from "@/navigation/types";
import { colors, spacing, typography } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "TallyIntegration">;

export function TallyIntegrationScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <Header title="Tally Prime" onBack={() => navigation.goBack()} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        <Card style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={typography.label}>Status</Text>
            <Badge label={TALLY_SYNC.connected ? "Connected" : "Not connected"} tone={TALLY_SYNC.connected ? "success" : "neutral"} />
          </View>
          <View style={styles.statusRow}>
            <Text style={typography.label}>Last Sync</Text>
            <Text style={styles.lastSync}>{TALLY_SYNC.lastSync}</Text>
          </View>
        </Card>

        <SectionHeader title="Orbit → Tally" />
        <View style={styles.statGrid}>
          <Card style={styles.statTile}>
            <Text style={styles.statValue}>{TALLY_SYNC.orbitToTally.transactions}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </Card>
          <Card style={styles.statTile}>
            <Text style={styles.statValue}>{TALLY_SYNC.orbitToTally.ledgers}</Text>
            <Text style={styles.statLabel}>Ledgers</Text>
          </Card>
          <Card style={styles.statTile}>
            <Text style={styles.statValue}>{TALLY_SYNC.orbitToTally.vouchers}</Text>
            <Text style={styles.statLabel}>Vouchers</Text>
          </Card>
        </View>

        <SectionHeader title="Tally → Orbit" />
        <View style={styles.statGrid}>
          <Card style={styles.statTile}>
            <Text style={styles.statValue}>{TALLY_SYNC.tallyToOrbit.records}</Text>
            <Text style={styles.statLabel}>Records</Text>
          </Card>
          <Card style={styles.statTile}>
            <Text style={[styles.statValue, { color: colors.red }]}>{TALLY_SYNC.tallyToOrbit.needsReview}</Text>
            <Text style={styles.statLabel}>Require Review</Text>
          </Card>
        </View>

        <Button label="Sync Now" onPress={() => navigation.navigate("TallySyncStatus")} style={styles.action} />
        <Button label="View Reconciliation" variant="secondary" onPress={() => navigation.navigate("TallyReconciliation")} style={styles.action} />
        <Button label="Export XML" variant="ghost" onPress={() => navigation.navigate("TallyXMLPreview")} style={styles.action} />

        <Text style={styles.footnote}>Prototype / Demo integration — no real Tally connection is made.</Text>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  statusCard: { marginBottom: spacing.md, gap: spacing.xs },
  statusRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4 },
  lastSync: { fontSize: 13, fontWeight: "700", color: colors.text },
  statGrid: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  statTile: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "800", color: colors.brand },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 4, textAlign: "center" },
  action: { marginBottom: spacing.sm },
  footnote: { fontSize: 11, color: colors.textFaint, textAlign: "center", marginTop: spacing.sm },
});
