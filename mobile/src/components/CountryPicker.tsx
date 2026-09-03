import React, { useMemo, useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Country, COUNTRIES } from "@/data/countries";
import { colors, radius, spacing, typography } from "@/theme";

import { Icon } from "./Icon";

interface Props {
  visible: boolean;
  selected: Country;
  onSelect: (country: Country) => void;
  onClose: () => void;
}

export function CountryPicker({ visible, selected, onSelect, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dialCode.includes(q)
    );
  }, [query]);

  const close = () => {
    setQuery("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={close} accessibilityLabel="Close" />

        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={typography.h3}>Select country</Text>
            <TouchableOpacity onPress={close} accessibilityRole="button" accessibilityLabel="Close" hitSlop={8}>
              <Icon name="x" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchRow}>
            <Icon name="search" size={16} color={colors.textFaint} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search country or code"
              placeholderTextColor={colors.textFaint}
              style={styles.searchInput}
              autoCorrect={false}
              accessibilityLabel="Search country"
            />
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.iso2}
            keyboardShouldPersistTaps="handled"
            style={styles.list}
            renderItem={({ item }) => {
              const active = item.iso2 === selected.iso2;
              return (
                <TouchableOpacity
                  style={styles.row}
                  activeOpacity={0.7}
                  onPress={() => {
                    onSelect(item);
                    close();
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.name}, +${item.dialCode}`}
                >
                  <Text style={styles.flag}>{item.flag}</Text>
                  <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.rowDial}>+{item.dialCode}</Text>
                  {active ? <Icon name="check" size={16} color={colors.brand} /> : null}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={<Text style={styles.empty}>No countries match "{query}"</Text>}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: "80%",
    paddingHorizontal: spacing.md,
  },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: "center", marginTop: spacing.sm },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.md },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginBottom: spacing.sm,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.text },
  list: { flexGrow: 0 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  flag: { fontSize: 22 },
  rowName: { flex: 1, fontSize: 15, fontWeight: "600", color: colors.text },
  rowDial: { fontSize: 14, fontWeight: "600", color: colors.textMuted },
  empty: { textAlign: "center", color: colors.textMuted, paddingVertical: spacing.xl },
});
