import React from "react";
import { Image, Modal, StyleSheet, Text, View } from "react-native";

import { Button } from "./Button";
import { colors, radius, spacing } from "@/theme";

interface Props {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
  showLogo?: boolean;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  danger,
  showLogo = true,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {showLogo ? (
            <Image source={require("../../assets/logos/mark.png")} style={styles.logo} resizeMode="contain" />
          ) : null}
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.actions}>
            <Button label={cancelLabel} variant="secondary" onPress={onCancel} style={styles.actionBtn} />
            <Button label={confirmLabel} variant={danger ? "danger" : "primary"} onPress={onConfirm} style={styles.actionBtn} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(11,61,46,0.45)", alignItems: "center", justifyContent: "center", padding: spacing.xl },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: "center",
    shadowColor: colors.brand,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  logo: { width: 48, height: 48, marginBottom: spacing.sm },
  title: { fontSize: 17, fontWeight: "800", color: colors.text, textAlign: "center" },
  message: { fontSize: 13, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs, lineHeight: 19 },
  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg, width: "100%" },
  actionBtn: { flex: 1, paddingHorizontal: spacing.sm },
});
