import React from "react";
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";

import { colors } from "@/theme";

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export function ScreenContainer({ children, scroll = true, edges = ["top"], style, contentStyle }: Props) {
  return (
    <SafeAreaView style={[styles.root, style]} edges={edges}>
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flexOne, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },
  flexOne: { flex: 1 },
});
