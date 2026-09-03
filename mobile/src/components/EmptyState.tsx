import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "./Button";
import { Icon, IconName } from "./Icon";
import { colors, spacing, typography } from "@/theme";

interface Props {
  icon?: IconName;
  title: string;
  description: string;
  ctaLabel?: string;
  onPress?: () => void;
}

export function EmptyState({ icon = "inbox", title, description, ctaLabel, onPress }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={30} color={colors.brand} />
      </View>
      <Text style={[typography.h2, styles.title]}>{title}</Text>
      <Text style={[typography.body, styles.desc]}>{description}</Text>
      {ctaLabel ? <Button label={ctaLabel} onPress={onPress} style={styles.cta} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", padding: spacing.xl },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.brandLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: { textAlign: "center", marginBottom: spacing.xs },
  desc: { textAlign: "center", color: colors.textMuted, marginBottom: spacing.lg },
  cta: { alignSelf: "stretch" },
});
