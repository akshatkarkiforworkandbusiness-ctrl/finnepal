import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { ProviderBadge } from "@/components/ProviderBadge";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, spacing, typography } from "@/theme";
import { getProvider } from "@/utils/providers";

type Props = NativeStackScreenProps<RootStackParamList, "ConnectionSuccess">;

export function ConnectionSuccessScreen({ navigation, route }: Props) {
  const provider = getProvider(route.params.providerId);
  const { connections } = useAppState();
  const connection = connections.find((c) => c.provider === provider.id);
  const scale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, [scale]);

  const goHome = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <Animated.View style={[styles.successIcon, { transform: [{ scale }] }]}>
          <Icon name="check-circle" size={40} color={colors.success} />
        </Animated.View>
        <ProviderBadge provider={provider} size={40} />
        <Text style={[typography.h2, styles.title]}>{provider.name} connected successfully</Text>
        <Text style={styles.importedText}>Demo connection only — no real data was accessed</Text>

        <View style={styles.detailBlock}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Connection date</Text>
            <Text style={styles.detailValue}>{connection?.connectedAt}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last synced</Text>
            <Text style={styles.detailValue}>{connection?.lastSynced}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Permissions</Text>
            <Text style={styles.detailValue}>{connection?.permissions.length} granted</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button label="Manage connection" variant="secondary" onPress={() => navigation.replace("ManageConnection", { providerId: provider.id })} />
        <Button label="Done" onPress={goHome} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, justifyContent: "space-between" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl, gap: spacing.sm },
  successIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.successSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  title: { textAlign: "center", marginTop: spacing.sm },
  importedText: { fontSize: 13, fontWeight: "700", color: colors.brand, marginTop: spacing.xs },
  detailBlock: { width: "100%", marginTop: spacing.lg },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.xs },
  detailLabel: { fontSize: 13, color: colors.textMuted },
  detailValue: { fontSize: 13, fontWeight: "700", color: colors.text },
  footer: { padding: spacing.lg, gap: spacing.xs },
});
