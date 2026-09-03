import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Icon } from "./Icon";
import { colors, spacing } from "@/theme";

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export function Header({ title, subtitle, onBack, right }: Props) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back" hitSlop={10} style={styles.back}>
            <Icon name="chevron-left" size={22} color={colors.text} />
          </TouchableOpacity>
        ) : null}
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.md, paddingVertical: spacing.md, minHeight: 56 },
  back: { width: 32, marginRight: spacing.xs, alignItems: "flex-start", justifyContent: "center" },
  titleWrap: { flex: 1 },
  title: { color: colors.text, fontSize: 18, fontWeight: "800" },
  subtitle: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  right: { marginLeft: spacing.sm, alignItems: "flex-end", justifyContent: "center" },
});
