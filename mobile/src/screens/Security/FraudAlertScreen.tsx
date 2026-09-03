import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Icon } from "@/components/Icon";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, spacing, typography } from "@/theme";
import { formatNPR } from "@/utils/format";
import { getProvider } from "@/utils/providers";

type Props = NativeStackScreenProps<RootStackParamList, "FraudAlert">;

export function FraudAlertScreen({ navigation }: Props) {
  const { transactions } = useAppState();
  const flagged = transactions.find((t) => t.status === "flagged");
  const provider = flagged ? getProvider(flagged.provider) : null;
  const [restricted, setRestricted] = useState(false);

  const wasMe = () => {
    navigation.goBack();
  };

  const notMe = () => {
    setRestricted(true);
  };

  if (restricted) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.content}>
          <View style={styles.iconWrap}>
            <Icon name="lock" size={32} color={colors.red} />
          </View>
          <Text style={[typography.h1, styles.title]}>Connection temporarily restricted</Text>
          <Text style={styles.restrictedText}>Review your connected accounts.</Text>
        </View>
        <View style={styles.footer}>
          <Button label="Review connected accounts" onPress={() => navigation.replace("SecurityPrivacy")} />
          <Button label="Back to security" variant="ghost" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  if (!flagged || !provider) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.content}>
          <Text style={[typography.h1, styles.title]}>No flagged activity</Text>
          <Text style={styles.restrictedText}>There's nothing to review right now.</Text>
        </View>
        <View style={styles.footer}>
          <Button label="Back to security" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Icon name="alert-triangle" size={32} color={colors.red} />
        </View>
        <Text style={[typography.h1, styles.title]}>Was this transaction yours?</Text>

        <Card style={styles.card}>
          <Text style={styles.amount}>{formatNPR(flagged.amount)}</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Provider</Text>
            <Text style={styles.rowValue}>{provider.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Description</Text>
            <Text style={styles.rowValue}>{flagged.description}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Status</Text>
            <Text style={[styles.rowValue, { color: colors.red }]}>Unusual activity</Text>
          </View>
        </Card>

        <Text style={styles.disclaimer}>
          Orbit uses simple rule-based checks to flag unusual activity in this prototype — not AI fraud detection.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button label="No, secure my account" variant="danger" onPress={notMe} />
        <Button label="Yes, it was me" variant="secondary" onPress={wasMe} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, justifyContent: "space-between" },
  content: { padding: spacing.lg, alignItems: "center" },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.redSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: { textAlign: "center", marginBottom: spacing.lg },
  restrictedText: { fontSize: 14, color: colors.textMuted, textAlign: "center" },
  card: { width: "100%", marginBottom: spacing.md },
  amount: { fontSize: 28, fontWeight: "800", color: colors.red, marginBottom: spacing.sm, textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  rowLabel: { fontSize: 13, color: colors.textMuted },
  rowValue: { fontSize: 13, fontWeight: "700", color: colors.text },
  disclaimer: { fontSize: 12, color: colors.textFaint, textAlign: "center", lineHeight: 17 },
  footer: { padding: spacing.lg, gap: spacing.xs },
});
