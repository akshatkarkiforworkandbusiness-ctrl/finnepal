import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { View } from "react-native";

import { Header } from "@/components/Header";
import { ScreenContainer } from "@/components/ScreenContainer";
import { RootStackParamList } from "@/navigation/types";
import { colors, spacing, typography } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Terms">;

export function TermsScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <Header title="Terms" onBack={() => navigation.goBack()} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        <Text style={typography.h3}>Prototype terms</Text>
        <Text style={styles.body}>
          This is a hackathon prototype built for demonstration purposes. All data shown, including transactions,
          balances, and connections, is simulated mock data. Orbit is not a licensed financial institution, does not
          hold or move real funds, and does not make lending or insurance decisions. Provider connections shown here
          use simulated sandbox authorization flows and do not connect to real bank, wallet, or payment accounts.
        </Text>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  body: { fontSize: 13, color: colors.textMuted, lineHeight: 20, marginTop: spacing.sm },
});
