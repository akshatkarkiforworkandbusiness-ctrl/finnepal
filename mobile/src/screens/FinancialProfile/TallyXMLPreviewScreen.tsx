import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { LoadingState } from "@/components/LoadingState";
import { ScreenContainer } from "@/components/ScreenContainer";
import { TALLY_XML_SUMMARY } from "@/data/mockTallySync";
import { RootStackParamList } from "@/navigation/types";
import { generateXml } from "@/services/tallyService";
import { colors, spacing, typography } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "TallyXMLPreview">;

export function TallyXMLPreviewScreen({ navigation }: Props) {
  const [phase, setPhase] = useState<"idle" | "generating" | "ready">("idle");

  const generate = async () => {
    setPhase("generating");
    await generateXml();
    setPhase("ready");
  };

  return (
    <View style={styles.root}>
      <Header title="Export Tally XML" onBack={() => navigation.goBack()} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        <Card style={styles.summaryCard}>
          <Text style={typography.h3}>Summary</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Ledgers</Text>
            <Text style={styles.rowValue}>{TALLY_XML_SUMMARY.ledgers}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Sales vouchers</Text>
            <Text style={styles.rowValue}>{TALLY_XML_SUMMARY.salesVouchers}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Payment vouchers</Text>
            <Text style={styles.rowValue}>{TALLY_XML_SUMMARY.paymentVouchers}</Text>
          </View>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Text style={styles.rowLabel}>Bank vouchers</Text>
            <Text style={styles.rowValue}>{TALLY_XML_SUMMARY.bankVouchers}</Text>
          </View>
        </Card>

        {phase === "idle" ? <Button label="Generate XML" onPress={generate} style={styles.action} /> : null}

        {phase === "generating" ? <LoadingState label="Generating XML..." /> : null}

        {phase === "ready" ? (
          <View style={styles.readyBlock}>
            <Icon name="check-circle" size={28} color={colors.success} />
            <Text style={styles.readyTitle}>XML Ready</Text>
            <Button
              label="Download XML"
              onPress={() => Alert.alert("XML downloaded", "Prototype only — no file is written to disk in this demo.")}
              style={styles.action}
            />
            <Text style={styles.footnote}>Prototype only — no file is written to disk in this demo.</Text>
          </View>
        ) : null}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  summaryCard: { marginBottom: spacing.md },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { fontSize: 13, color: colors.textMuted },
  rowValue: { fontSize: 13, fontWeight: "800", color: colors.text },
  action: { marginTop: spacing.sm },
  readyBlock: { alignItems: "center", paddingVertical: spacing.lg },
  readyTitle: { fontSize: 17, fontWeight: "800", color: colors.text, marginTop: spacing.sm, marginBottom: spacing.md },
  footnote: { fontSize: 11, color: colors.textFaint, textAlign: "center", marginTop: spacing.sm },
});
