import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Toggle } from "@/components/Toggle";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, spacing } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Notifications">;

export function NotificationsScreen({ navigation }: Props) {
  const { notificationSettings, toggleNotification } = useAppState();

  return (
    <View style={styles.root}>
      <Header title="Notifications" onBack={() => navigation.goBack()} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        <Card padded={false}>
          {notificationSettings.map((n, i) => (
            <View key={n.id} style={[styles.row, i === notificationSettings.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={styles.label}>{n.label}</Text>
              <Toggle value={n.enabled} onValueChange={() => toggleNotification(n.id)} accessibilityLabel={n.label} />
            </View>
          ))}
        </Card>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: { fontSize: 14, fontWeight: "600", color: colors.text, flex: 1, marginRight: spacing.sm },
});
