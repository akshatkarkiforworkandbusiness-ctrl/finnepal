import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { Icon, IconName } from "@/components/Icon";
import { ScreenContainer } from "@/components/ScreenContainer";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { BusinessType } from "@/types";
import { colors, radius, spacing, typography } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "BusinessType">;

const OPTIONS: { type: BusinessType; icon: IconName }[] = [
  { type: "Grocery / Kirana", icon: "grocery" },
  { type: "Restaurant / Cafe", icon: "restaurant" },
  { type: "Clothing", icon: "clothing" },
  { type: "Pharmacy", icon: "pharmacy" },
  { type: "Electronics", icon: "electronics" },
  { type: "Other", icon: "storefront" },
];

export function BusinessTypeScreen({ navigation }: Props) {
  const { business, updateBusiness } = useAppState();
  const [selected, setSelected] = useState<BusinessType>(business.type);

  const continueNext = () => {
    updateBusiness({ type: selected });
    navigation.navigate("BusinessSetup");
  };

  return (
    <View style={styles.root}>
      <Header title="Business Type" subtitle="What type of business do you run?" onBack={() => navigation.goBack()} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        {OPTIONS.map((o) => {
          const isSelected = selected === o.type;
          return (
            <TouchableOpacity
              key={o.type}
              onPress={() => setSelected(o.type)}
              activeOpacity={0.8}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              style={[styles.card, isSelected && styles.cardSelected]}
            >
              <View style={[styles.iconWrap, isSelected && styles.iconWrapSelected]}>
                <Icon name={o.icon} size={20} color={isSelected ? colors.white : colors.brand} />
              </View>
              <Text style={[styles.label, isSelected && styles.labelSelected]}>{o.type}</Text>
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected ? <View style={styles.radioDot} /> : null}
              </View>
            </TouchableOpacity>
          );
        })}

        <Button label="Continue" onPress={continueNext} style={styles.cta} />
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  cardSelected: { borderColor: colors.brand, backgroundColor: colors.brandLight },
  iconWrap: { width: 38, height: 38, borderRadius: radius.md, backgroundColor: colors.brandLight, alignItems: "center", justifyContent: "center" },
  iconWrapSelected: { backgroundColor: colors.brand },
  label: { flex: 1, fontSize: 15, fontWeight: "700", color: colors.text },
  labelSelected: { color: colors.brand },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  radioSelected: { borderColor: colors.brand },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.brand },
  cta: { marginTop: spacing.md },
});
