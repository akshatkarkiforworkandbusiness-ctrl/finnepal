import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { sendAiMessage } from "@/api/ai";
import { ApiError } from "@/api/client";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, radius, spacing } from "@/theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

function Bubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <View style={[styles.bubbleRow, isUser && styles.bubbleRowUser]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={isUser ? styles.bubbleTextUser : styles.bubbleTextAssistant}>{message.text}</Text>
      </View>
    </View>
  );
}

export function AIAssistantScreen() {
  const navigation = useNavigation<Nav>();
  const { business, summary } = useAppState();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: `Hi, I'm Orbit AI. Ask me about ${business.name}'s cash flow, sales, or expenses.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;
    setInput("");
    const userMessage: ChatMessage = { id: `u-${Date.now()}`, role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);
    try {
      const res = await sendAiMessage(text);
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", text: res.reply }]);
    } catch (err) {
      const text = err instanceof ApiError && err.status === 429 ? "Too many requests — try again in a minute." : "Something went wrong. Try again.";
      setMessages((prev) => [...prev, { id: `e-${Date.now()}`, role: "assistant", text }]);
    } finally {
      setIsSending(false);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  };

  return (
    <View style={styles.root}>
      <Header title="Orbit AI" subtitle={`${summary.net >= 0 ? "Net positive" : "Net negative"} this period`} onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView style={styles.flexOne} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <Bubble message={item} />}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />
        {isSending ? (
          <View style={styles.typingRow}>
            <ActivityIndicator size="small" color={colors.textMuted} />
            <Text style={styles.typingText}>Orbit AI is thinking…</Text>
          </View>
        ) : null}
        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about your cash flow…"
            placeholderTextColor={colors.textFaint}
            style={styles.input}
            multiline
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!input.trim() || isSending}
            style={[styles.sendButton, (!input.trim() || isSending) && styles.sendButtonDisabled]}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <Icon name="send" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flexOne: { flex: 1 },
  messageList: { padding: spacing.md, gap: spacing.sm },
  bubbleRow: { flexDirection: "row", marginBottom: spacing.xs },
  bubbleRowUser: { justifyContent: "flex-end" },
  bubble: { maxWidth: "82%", borderRadius: radius.lg, paddingHorizontal: spacing.sm + 4, paddingVertical: spacing.sm },
  bubbleAssistant: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderTopLeftRadius: 4 },
  bubbleUser: { backgroundColor: colors.brand, borderTopRightRadius: 4 },
  bubbleTextAssistant: { color: colors.text, fontSize: 15, lineHeight: 21 },
  bubbleTextUser: { color: colors.white, fontSize: 15, lineHeight: 21 },
  typingRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs, paddingHorizontal: spacing.md, paddingBottom: spacing.xs },
  typingText: { color: colors.textMuted, fontSize: 12 },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: { opacity: 0.4 },
});
