import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, radius, spacing } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "ActivityLog">;

export function ActivityLogScreen({ navigation }: Props) {
  const { activityLog } = useAppState();

  return (
    <View style={styles.root}>
      <Header title="Activity Log" onBack={() => navigation.goBack()} />
      <FlatList
        data={activityLog}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.dot}>
              <Icon name="check-circle" size={14} color={colors.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.lg },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm + 4,
    marginBottom: spacing.sm,
  },
  dot: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.successSoft, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 13, fontWeight: "700", color: colors.text },
  time: { fontSize: 12, color: colors.textFaint, marginTop: 2 },
});
