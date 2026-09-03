import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon, IconName } from "@/components/Icon";
import { colors, radius, spacing } from "@/theme";

import { MainTabParamList } from "./types";

const TAB_ICONS: Record<keyof MainTabParamList, IconName> = {
  Home: "home",
  Transactions: "credit-card",
  Insights: "bar-chart-2",
  FinancialProfile: "user",
  More: "grid",
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const label = (options.tabBarLabel as string) ?? options.title ?? route.name;

        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={label}
            style={styles.item}
            activeOpacity={0.75}
          >
            <View style={[styles.pill, focused && styles.pillActive]}>
              <Icon
                name={TAB_ICONS[route.name as keyof MainTabParamList]}
                size={19}
                color={focused ? colors.brand : colors.textFaint}
              />
              <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xs,
    ...Platform.select({
      android: { elevation: 12 },
      ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: -2 } },
    }),
  },
  item: { flex: 1, alignItems: "center" },
  pill: {
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: radius.md,
    minWidth: 0,
    width: "100%",
  },
  pillActive: { backgroundColor: colors.brandLight },
  label: { fontSize: 9.5, fontWeight: "700", color: colors.textFaint },
  labelActive: { color: colors.brand },
});
