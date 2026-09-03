import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { ScreenContainer } from "@/components/ScreenContainer";
import { RootStackParamList } from "@/navigation/types";
import { colors, spacing, typography } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "HelpCenter">;

const FAQS = [
  { q: "What is Orbit?", a: "Orbit is a financial operating layer for small businesses. It helps you organize business activity — sales, expenses, cash flow, reconciliation and accounting — in one place. It is not a bank, wallet, or payment provider." },
  { q: "Does Orbit move my money?", a: "No. Orbit uses read-only access and never moves funds on your behalf." },
  { q: "Does Orbit replace Tally?", a: "No. Tally remains your accounting workflow — Orbit connects to it to help you reconcile and sync." },
  { q: "Can I disconnect an account anytime?", a: "Yes. Go to Security & Privacy and disconnect any connected account instantly." },
  { q: "Does Orbit decide if I qualify for financing?", a: "No. Orbit summarizes your organized financial history. Final decisions are always made by participating institutions." },
];

export function HelpCenterScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <Header title="Help" onBack={() => navigation.goBack()} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        {FAQS.map((f) => (
          <Card key={f.q} style={styles.card}>
            <View style={styles.qRow}>
              <Icon name="help-circle" size={15} color={colors.brand} />
              <Text style={styles.question}>{f.q}</Text>
            </View>
            <Text style={styles.answer}>{f.a}</Text>
          </Card>
        ))}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  card: { marginBottom: spacing.sm },
  qRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xs },
  question: { fontSize: 14, fontWeight: "700", color: colors.text, flex: 1 },
  answer: { fontSize: 13, color: colors.textMuted, lineHeight: 18 },
});
