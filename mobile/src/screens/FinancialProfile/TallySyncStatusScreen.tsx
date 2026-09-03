import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SyncStatusCard } from "@/components/SyncStatusCard";
import { TALLY_SYNC } from "@/data/mockTallySync";
import { RootStackParamList } from "@/navigation/types";
import { runSync } from "@/services/tallyService";
import { useAppState } from "@/state/AppContext";
import { TallySyncStep } from "@/types";
import { colors, spacing } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "TallySyncStatus">;

export function TallySyncStatusScreen({ navigation }: Props) {
  const { logActivity } = useAppState();
  const [steps, setSteps] = useState<TallySyncStep[]>(TALLY_SYNC.steps.map((s) => ({ ...s, done: false })));
  const [activeIndex, setActiveIndex] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    runSync((step, index) => {
      if (cancelled) return;
      setSteps((prev) => prev.map((s, i) => (i === index ? step : s)));
      setActiveIndex(index + 1);
    }).then(() => {
      if (!cancelled) {
        setComplete(true);
        logActivity("Tally sync completed");
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.root}>
      <Header title="Tally Sync Status" onBack={() => navigation.goBack()} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        <Text style={styles.badge}>Prototype / Demo Sync</Text>

        <Card>
          <SyncStatusCard steps={steps} activeIndex={activeIndex} />
        </Card>

        {complete ? (
          <>
            <Text style={styles.resultText}>{TALLY_SYNC.orbitToTally.transactions} transactions synced</Text>
            <Button label="Done" onPress={() => navigation.goBack()} style={styles.done} />
          </>
        ) : null}
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  badge: { alignSelf: "center", fontSize: 11, fontWeight: "700", color: colors.textFaint, marginBottom: spacing.md, textTransform: "uppercase", letterSpacing: 0.5 },
  resultText: { textAlign: "center", fontSize: 15, fontWeight: "800", color: colors.success, marginTop: spacing.lg },
  done: { marginTop: spacing.lg },
});
