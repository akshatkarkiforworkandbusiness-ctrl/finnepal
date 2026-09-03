import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ConsentCard } from "@/components/ConsentCard";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { ScreenContainer } from "@/components/ScreenContainer";
import { CONSENT_REQUESTS } from "@/data/mockConsentRequests";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, spacing, typography } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "ShareConsent">;

export function ShareConsentScreen({ navigation }: Props) {
  const { grantConsent, declineConsent } = useAppState();
  const request = CONSENT_REQUESTS[0];
  const [items, setItems] = useState(request.dataItems);
  const [result, setResult] = useState<"allowed" | "declined" | null>(null);

  const toggle = (id: string) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i)));

  const allow = () => {
    grantConsent(request.id, request.durationDays);
    setResult("allowed");
  };

  const decline = () => {
    declineConsent(request.id);
    setResult("declined");
  };

  if (result) {
    return (
      <View style={styles.root}>
        <Header title="Share Financial Profile" onBack={() => navigation.goBack()} />
        <View style={styles.confirmWrap}>
          <View style={[styles.confirmIcon, result === "declined" && { backgroundColor: colors.redSoft }]}>
            <Icon name={result === "allowed" ? "check-circle" : "x"} size={36} color={result === "allowed" ? colors.success : colors.red} />
          </View>
          <Text style={[typography.h2, styles.confirmTitle]}>{result === "allowed" ? "Shared securely" : "Request declined"}</Text>
          <Text style={styles.confirmText}>
            {result === "allowed"
              ? `Your Financial Profile was shared with ${request.requesterName} for ${request.durationDays} days. You control what information is shared and can revoke access anytime from Security & Privacy.`
              : `No information was shared with ${request.requesterName}.`}
          </Text>
          <Button label="Done" onPress={() => navigation.popToTop()} style={styles.confirmBtn} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Header title="Share Financial Profile" onBack={() => navigation.goBack()} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        <Card style={styles.requesterCard}>
          <Text style={styles.requesterName}>{request.requesterName}</Text>
          <Text style={typography.label}>Purpose</Text>
          <Text style={styles.purpose}>{request.purpose}</Text>
        </Card>

        <Text style={[typography.label, styles.sectionLabel]}>Requested data</Text>
        <Card padded={false} style={styles.dataCard}>
          <View style={{ paddingHorizontal: spacing.md }}>
            <ConsentCard items={items} onToggle={toggle} />
          </View>
        </Card>

        <View style={styles.durationRow}>
          <Text style={styles.durationLabel}>Duration</Text>
          <Text style={styles.durationValue}>{request.durationDays} days</Text>
        </View>

        <View style={styles.notice}>
          <Icon name="lock" size={14} color={colors.brand} />
          <Text style={styles.noticeText}>You control what information is shared. Nothing is shared with any external party in this prototype.</Text>
        </View>

        <Button label="Allow" onPress={allow} style={styles.actionBtn} />
        <Button label="Decline" variant="ghost" onPress={decline} />
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  requesterCard: { marginBottom: spacing.md, gap: 4 },
  requesterName: { fontSize: 17, fontWeight: "800", color: colors.text, marginBottom: spacing.sm },
  purpose: { fontSize: 14, color: colors.text, marginTop: 2 },
  sectionLabel: { marginBottom: spacing.xs },
  dataCard: { marginBottom: spacing.md, paddingVertical: spacing.sm },
  durationRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.md },
  durationLabel: { fontSize: 13, color: colors.textMuted },
  durationValue: { fontSize: 13, fontWeight: "800", color: colors.text },
  notice: { flexDirection: "row", gap: spacing.sm, backgroundColor: colors.brandLight, borderRadius: 14, padding: spacing.sm + 4, marginBottom: spacing.lg },
  noticeText: { flex: 1, fontSize: 12, color: colors.brand, lineHeight: 17 },
  actionBtn: { marginBottom: spacing.xs },
  confirmWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  confirmIcon: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.successSoft, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  confirmTitle: { marginBottom: spacing.sm },
  confirmText: { textAlign: "center", color: colors.textMuted, marginBottom: spacing.lg },
  confirmBtn: { alignSelf: "stretch" },
});
