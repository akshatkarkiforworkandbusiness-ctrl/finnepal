import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, radius, spacing, typography } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "BusinessSetup">;

export function BusinessSetupScreen({ navigation }: Props) {
  const { business, updateBusiness, completeBusinessSetup } = useAppState();
  const [name, setName] = useState(business.name);
  const [location, setLocation] = useState(business.location);
  const [panVat, setPanVat] = useState(business.panVat);
  const [fiscalYear, setFiscalYear] = useState(business.fiscalYear);

  const valid = name.trim().length > 0 && location.trim().length > 0;

  const continueNext = () => {
    updateBusiness({ name: name.trim(), location: location.trim(), panVat: panVat.trim(), fiscalYear: fiscalYear.trim() });
    completeBusinessSetup();
    navigation.navigate("ConnectAccounts");
  };

  return (
    <View style={styles.root}>
      <Header title="Business Setup" subtitle="Tell us about your business" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={styles.flexOne} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <FormField label="Business Name" value={name} onChangeText={setName} placeholder="e.g. Amit Stores" />
          <TouchableOpacity
            style={styles.readonly}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("BusinessType")}
            accessibilityRole="button"
            accessibilityLabel="Change business type"
          >
            <Text style={typography.label}>Business Type</Text>
            <View style={styles.readonlyRow}>
              <Text style={styles.readonlyValue}>{business.type}</Text>
              <Icon name="chevron-right" size={16} color={colors.textFaint} />
            </View>
          </TouchableOpacity>
          <FormField label="Location" value={location} onChangeText={setLocation} placeholder="e.g. Kathmandu, Nepal" />
          <FormField label="PAN / VAT Number" value={panVat} onChangeText={setPanVat} placeholder="e.g. 123456789" keyboardType="number-pad" />
          <FormField label="Fiscal Year" value={fiscalYear} onChangeText={setFiscalYear} placeholder="e.g. Shrawan (July)" />

          <Button label="Continue" disabled={!valid} onPress={continueNext} style={styles.cta} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flexOne: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  readonly: {
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 12,
  },
  readonlyRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 },
  readonlyValue: { fontSize: 15, color: colors.text, fontWeight: "600" },
  cta: { marginTop: spacing.sm },
});
