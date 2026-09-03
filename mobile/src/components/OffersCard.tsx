import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Card } from "@/components/Card";
import { Icon } from "@/components/Icon";
import { colors, radius, spacing } from "@/theme";

interface Props {
  onPress?: () => void;
}

export function OffersCard({ onPress }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} accessibilityRole="button">
      <Card style={styles.card}>
        <View style={styles.iconWrap}>
          <Icon name="gift" size={16} color={colors.brand} />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.title}>Offers & Promocodes</Text>
          <Text style={styles.subtitle}>View all offers & available promocodes</Text>
        </View>
        <Icon name="chevron-right" size={16} color={colors.textFaint} />
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: { flex: 1 },
  title: { fontSize: 14, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 12, color: colors.textFaint, marginTop: 2 },
});
