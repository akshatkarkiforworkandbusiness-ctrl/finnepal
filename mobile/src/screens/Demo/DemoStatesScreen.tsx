import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { ScreenContainer } from "@/components/ScreenContainer";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, spacing } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "DemoStates">;

const STATES = [
  { kind: "empty" as const, label: "Empty state", description: "No accounts connected yet" },
  { kind: "error" as const, label: "Error state", description: "Network / connection failure" },
  { kind: "sync" as const, label: "Sync state", description: "Skeleton loading placeholders" },
];

export function DemoStatesScreen({ navigation }: Props) {
  const { resetApp } = useAppState();

  const replayOnboarding = () => {
    resetApp();
    navigation.replace("Splash");
  };

  return (
    <View style={styles.root}>
      <Header title="Demo states" subtitle="For hackathon demo purposes" onBack={() => navigation.goBack()} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        <TouchableOpacity onPress={replayOnboarding} activeOpacity={0.8}>
          <Card style={styles.card}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Replay onboarding & auth</Text>
                <Text style={styles.description}>Reset saved app state and return to the splash screen</Text>
              </View>
              <Icon name="refresh-cw" size={16} color={colors.textFaint} />
            </View>
          </Card>
        </TouchableOpacity>

        {STATES.map((s) => (
          <TouchableOpacity key={s.kind} onPress={() => navigation.navigate("StateDemo", { kind: s.kind })} activeOpacity={0.8}>
            <Card style={styles.card}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>{s.label}</Text>
                  <Text style={styles.description}>{s.description}</Text>
                </View>
                <Icon name="chevron-right" size={16} color={colors.textFaint} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  card: { marginBottom: spacing.sm },
  row: { flexDirection: "row", alignItems: "center" },
  label: { fontSize: 15, fontWeight: "800", color: colors.text, marginBottom: 2 },
  description: { fontSize: 12, color: colors.textMuted },
});
