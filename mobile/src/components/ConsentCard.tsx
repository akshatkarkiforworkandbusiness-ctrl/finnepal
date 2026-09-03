import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Icon } from "./Icon";
import { colors, radius, spacing } from "@/theme";
import { ConsentDataItem } from "@/types";

interface Props {
  items: ConsentDataItem[];
  onToggle: (id: string) => void;
}

export function ConsentCard({ items, onToggle }: Props) {
  return (
    <View>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => onToggle(item.id)}
          activeOpacity={0.75}
          style={styles.row}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.selected }}
        >
          <View style={[styles.checkbox, item.selected && styles.checkboxOn]}>
            {item.selected ? <Icon name="check" size={13} color={colors.white} /> : null}
          </View>
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: spacing.sm },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm - 4,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: colors.brand, borderColor: colors.brand },
  label: { fontSize: 14, fontWeight: "600", color: colors.text, flex: 1 },
});
