import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { getOrCreateRealBusinessId } from "@/api/businesses";
import { getPaymentStatus, initiatePayment } from "@/api/payments";
import { Button } from "@/components/Button";
import { FormField } from "@/components/FormField";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, SOURCE_CHANNELS } from "@/data/mockCategories";
import { CUSTOMERS } from "@/data/mockCustomers";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { Category, ProviderId, TransactionChannel, TransactionType } from "@/types";
import { colors, radius, spacing, typography } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "AddTransaction">;

const CHANNEL_PROVIDER: Record<TransactionChannel, ProviderId> = {
  Bank: "nabil",
  eSewa: "esewa",
  Khalti: "khalti",
  Cash: "cash",
  Tally: "tally",
  Other: "cash",
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function AddTransactionScreen({ navigation, route }: Props) {
  const { transactions, addTransaction, updateTransaction, business } = useAppState();
  const editing = transactions.find((t) => t.id === route.params?.editId);

  const [type, setType] = useState<TransactionType>(editing?.type ?? route.params?.initialType ?? "income");
  const [amount, setAmount] = useState(editing ? String(editing.amount) : "");
  const [category, setCategory] = useState<Category>(() => {
    if (editing) {
      const pool = editing.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
      return pool.find((c) => c.id === editing.categoryId) ?? pool[0];
    }
    return INCOME_CATEGORIES[0];
  });
  const [channel, setChannel] = useState<TransactionChannel>(editing?.channel ?? "Cash");
  const [customerId, setCustomerId] = useState<string | undefined>(editing?.customerId);
  const [date, setDate] = useState(editing ? editing.date.slice(0, 10) : todayISO());
  const [note, setNote] = useState(editing?.note ?? "");
  const [isCollecting, setIsCollecting] = useState(false);
  const [pendingPaymentId, setPendingPaymentId] = useState<string | null>(null);

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const amountValue = Number(amount.replace(/[^0-9.]/g, ""));
  const valid = amountValue > 0;

  const submit = () => {
    if (!valid) return;
    const customer = CUSTOMERS.find((c) => c.id === customerId);
    const payload = {
      type,
      amount: amountValue,
      categoryId: category.id,
      categoryName: category.name,
      channel,
      provider: CHANNEL_PROVIDER[channel],
      customerId,
      customerName: customer?.name,
      date: new Date(date).toISOString(),
      note: note.trim() || undefined,
      description: customer ? `${category.name} - ${customer.name}` : category.name,
    };
    if (editing) updateTransaction(editing.id, payload);
    else addTransaction(payload);
    navigation.goBack();
  };

  const recordCollectedPayment = () => {
    addTransaction({
      type: "income",
      amount: amountValue,
      categoryId: category.id,
      categoryName: category.name,
      channel,
      provider: CHANNEL_PROVIDER[channel],
      customerId,
      customerName: CUSTOMERS.find((c) => c.id === customerId)?.name,
      date: new Date().toISOString(),
      note: note.trim() || undefined,
      description: `${category.name} — collected via ${channel}`,
    });
  };

  const collectPayment = async () => {
    if (!valid) return;
    setIsCollecting(true);
    try {
      const businessId = await getOrCreateRealBusinessId(business.name, business.type, business.location);
      const provider = channel === "eSewa" ? "esewa" : "khalti";
      const { paymentIntentId, url } = await initiatePayment(provider, businessId, amountValue);
      setPendingPaymentId(paymentIntentId);
      await Linking.openURL(url);
    } catch (err) {
      Alert.alert("Could not start payment", err instanceof Error ? err.message : "Try again.");
    } finally {
      setIsCollecting(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!pendingPaymentId) return;
    setIsCollecting(true);
    try {
      const result = await getPaymentStatus(pendingPaymentId);
      if (result.status === "COMPLETED") {
        recordCollectedPayment();
        setPendingPaymentId(null);
        navigation.goBack();
      } else if (result.status === "FAILED") {
        Alert.alert("Payment failed", result.failure_reason ?? "The payment wasn't completed.");
        setPendingPaymentId(null);
      } else {
        Alert.alert("Still pending", "Complete the payment in your browser, then check again.");
      }
    } catch {
      Alert.alert("Couldn't check status", "Try again in a moment.");
    } finally {
      setIsCollecting(false);
    }
  };

  return (
    <View style={styles.root}>
      <Header title={editing ? "Edit Transaction" : "Add Transaction"} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={styles.flexOne} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.typeRow}>
          <TouchableOpacity
            onPress={() => {
              setType("income");
              setCategory(INCOME_CATEGORIES[0]);
            }}
            style={[styles.typeBtn, type === "income" && styles.typeBtnActiveIncome]}
          >
            <Icon name="arrow-down-left" size={16} color={type === "income" ? colors.white : colors.success} />
            <Text style={[styles.typeLabel, type === "income" && styles.typeLabelActive]}>Income</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setType("expense");
              setCategory(EXPENSE_CATEGORIES[0]);
            }}
            style={[styles.typeBtn, type === "expense" && styles.typeBtnActiveExpense]}
          >
            <Icon name="arrow-up-right" size={16} color={type === "expense" ? colors.white : colors.red} />
            <Text style={[styles.typeLabel, type === "expense" && styles.typeLabelActive]}>Expense</Text>
          </TouchableOpacity>
        </View>

        <Text style={[typography.label, styles.sectionLabel]}>Amount (NPR)</Text>
        <TextInput
          value={amount}
          onChangeText={(v) => setAmount(v.replace(/[^0-9.]/g, ""))}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={colors.textFaint}
          style={styles.amountInput}
          accessibilityLabel="Amount"
        />

        <Text style={[typography.label, styles.sectionLabel]}>Category</Text>
        <View style={styles.chipRow}>
          {categories.map((c) => (
            <TouchableOpacity key={c.id} onPress={() => setCategory(c)} style={[styles.chip, category.id === c.id && styles.chipActive]}>
              <Text style={[styles.chipLabel, category.id === c.id && styles.chipLabelActive]}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[typography.label, styles.sectionLabel]}>Source / Channel</Text>
        <View style={styles.chipRow}>
          {SOURCE_CHANNELS.map((c) => (
            <TouchableOpacity key={c} onPress={() => setChannel(c)} style={[styles.chip, channel === c && styles.chipActive]}>
              <Text style={[styles.chipLabel, channel === c && styles.chipLabelActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {!editing && type === "income" && (channel === "eSewa" || channel === "Khalti") && (
          <View style={styles.collectBox}>
            <Text style={styles.collectTitle}>Collect this payment for real</Text>
            <Text style={styles.collectSubtitle}>
              Opens a real {channel} sandbox checkout. On success this creates a real transaction on the server.
            </Text>
            {pendingPaymentId ? (
              <Button label="I've completed payment — check status" onPress={checkPaymentStatus} loading={isCollecting} variant="secondary" />
            ) : (
              <Button
                label={isCollecting ? "Starting…" : `Collect via ${channel}`}
                onPress={collectPayment}
                loading={isCollecting}
                disabled={!valid}
                variant="secondary"
              />
            )}
          </View>
        )}

        <Text style={[typography.label, styles.sectionLabel]}>Customer (optional)</Text>
        <View style={styles.chipRow}>
          <TouchableOpacity onPress={() => setCustomerId(undefined)} style={[styles.chip, !customerId && styles.chipActive]}>
            <Text style={[styles.chipLabel, !customerId && styles.chipLabelActive]}>None</Text>
          </TouchableOpacity>
          {CUSTOMERS.map((c) => (
            <TouchableOpacity key={c.id} onPress={() => setCustomerId(c.id)} style={[styles.chip, customerId === c.id && styles.chipActive]}>
              <Text style={[styles.chipLabel, customerId === c.id && styles.chipLabelActive]}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FormField label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" />
        <FormField label="Note (optional)" value={note} onChangeText={setNote} placeholder="Add a note" multiline />

        <Button label={editing ? "Save Changes" : "Save Transaction"} variant="danger" disabled={!valid} onPress={submit} style={styles.save} />
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flexOne: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  typeRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  typeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  typeBtnActiveIncome: { backgroundColor: colors.success, borderColor: colors.success },
  typeBtnActiveExpense: { backgroundColor: colors.red, borderColor: colors.red },
  typeLabel: { fontSize: 14, fontWeight: "700", color: colors.text },
  typeLabelActive: { color: colors.white },
  sectionLabel: { marginBottom: spacing.xs, marginTop: spacing.md },
  amountInput: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { borderColor: colors.brand, backgroundColor: colors.brandLight },
  chipLabel: { fontSize: 13, fontWeight: "700", color: colors.text },
  chipLabelActive: { color: colors.brand },
  collectBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.brand,
    backgroundColor: colors.brandLight,
    gap: spacing.sm,
  },
  collectTitle: { fontSize: 14, fontWeight: "800", color: colors.brandDark },
  collectSubtitle: { fontSize: 12, color: colors.textMuted, marginTop: -4 },
  save: { marginTop: spacing.lg },
});
