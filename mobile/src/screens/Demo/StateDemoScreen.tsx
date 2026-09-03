import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/Header";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Skeleton } from "@/components/Skeleton";
import { RootStackParamList } from "@/navigation/types";
import { colors, spacing } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "StateDemo">;

export function StateDemoScreen({ navigation, route }: Props) {
  const { kind } = route.params;

  return (
    <View style={styles.root}>
      <Header
        title={kind === "empty" ? "Empty state" : kind === "error" ? "Error state" : "Sync state"}
        onBack={() => navigation.goBack()}
      />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        {kind === "empty" ? (
          <EmptyState
            icon="inbox"
            title="Your financial orbit is waiting."
            description="Add your first transaction to see your business activity in one place."
            ctaLabel="Add transaction"
            onPress={() => navigation.navigate("AddTransaction", {})}
          />
        ) : null}

        {kind === "error" ? (
          <EmptyState
            icon="wifi-off"
            title="Unable to connect right now."
            description="Your data has not been changed."
            ctaLabel="Try again"
            onPress={() => {}}
          />
        ) : null}

        {kind === "sync" ? (
          <View>
            <Text style={styles.hint}>Skeleton loaders — shown while dashboard, transactions, insights, or connections data is syncing.</Text>
            <Card style={styles.card}>
              <Skeleton height={80} style={{ marginBottom: spacing.sm }} />
              <Skeleton width="60%" height={16} style={{ marginBottom: spacing.xs }} />
              <Skeleton width="40%" height={12} />
            </Card>
            <Card style={styles.card}>
              <Skeleton width="80%" height={14} style={{ marginBottom: spacing.sm }} />
              <Skeleton width="50%" height={14} />
            </Card>
            <Card style={styles.card}>
              <Skeleton width="90%" height={14} style={{ marginBottom: spacing.sm }} />
              <Skeleton width="70%" height={14} />
            </Card>
          </View>
        ) : null}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  hint: { fontSize: 12, color: colors.textFaint, marginBottom: spacing.md },
  card: { marginBottom: spacing.sm },
});
