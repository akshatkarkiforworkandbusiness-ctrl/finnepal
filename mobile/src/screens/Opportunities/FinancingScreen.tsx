import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { ScreenContainer } from "@/components/ScreenContainer";
import { FINANCING_OPTIONS } from "@/data/mockFinancing";
import { RootStackParamList } from "@/navigation/types";
import { colors, radius, spacing, typography } from "@/theme";
import { formatNPR } from "@/utils/format";

type Props = NativeStackScreenProps<RootStackParamList, "Financing">;

export function FinancingScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <Header title="Financial Services" onBack={() => navigation.goBack()} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        <Text style={[typography.h1, styles.title]}>Prepare information for financial-service applications.</Text>
        <Text style={styles.intro}>
          Your organized financial history can help you prepare information for financial-service applications.
          These are example categories only — not offers, approvals, or a credit assessment.
        </Text>

        <Text style={[typography.label, styles.sectionLabel]}>Example categories</Text>
        {FINANCING_OPTIONS.map((opt) => (
          <Card key={opt.id} style={styles.optionCard}>
            <View style={styles.optionHeader}>
              <Icon name="briefcase" size={18} color={colors.brand} />
              <Text style={styles.optionTitle}>{opt.title}</Text>
            </View>
            <Text style={styles.optionAmount}>Up to {formatNPR(opt.maxAmount)}</Text>
            <Text style={styles.optionNote}>{opt.note}</Text>
            <Button
              label="Learn more"
              variant="secondary"
              onPress={() => Alert.alert(opt.title, "This is a demo recommendation. A participating financial institution would follow up with next steps.")}
              style={styles.optionCta}
            />
          </Card>
        ))}

        <View style={styles.disclaimer}>
          <Icon name="info" size={13} color={colors.textMuted} />
          <Text style={styles.disclaimerText}>
            Orbit does not approve or provide loans. Final decisions are made by participating financial institutions.
          </Text>
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  title: { marginBottom: spacing.sm },
  intro: { fontSize: 13, color: colors.textMuted, lineHeight: 19, marginBottom: spacing.md },
  sectionLabel: { marginBottom: spacing.xs },
  optionCard: { marginBottom: spacing.sm },
  optionHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: 4 },
  optionTitle: { fontSize: 15, fontWeight: "800", color: colors.text },
  optionAmount: { fontSize: 18, fontWeight: "800", color: colors.brand, marginBottom: 2 },
  optionNote: { fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm },
  optionCta: { alignSelf: "flex-start", paddingHorizontal: spacing.md, minHeight: 40 },
  disclaimer: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  disclaimerText: { flex: 1, fontSize: 12, color: colors.textMuted, lineHeight: 17 },
});
