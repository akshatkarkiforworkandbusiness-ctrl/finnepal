import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Icon } from "./Icon";
import { colors, spacing } from "@/theme";

interface Props {
  name: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  photoUri?: string;
  onChangePhoto?: () => void;
}

export function ProfileCard({ name, subtitle, email, phone, photoUri, onChangePhoto }: Props) {
  const avatar = (
    <View style={styles.avatarWrap}>
      <View style={styles.avatar}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarLetter}>{name.charAt(0)}</Text>
        )}
      </View>
      {onChangePhoto ? (
        <View style={styles.cameraBadge}>
          <Icon name="camera" size={13} color={colors.white} />
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.header}>
      {onChangePhoto ? (
        <TouchableOpacity onPress={onChangePhoto} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Change profile photo">
          {avatar}
        </TouchableOpacity>
      ) : (
        avatar
      )}
      <Text style={styles.name}>{name}</Text>
      {subtitle ? <Text style={styles.meta}>{subtitle}</Text> : null}
      {email ? <Text style={styles.contact}>{email}</Text> : null}
      {phone ? <Text style={styles.contact}>{phone}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.surface, alignItems: "center", paddingVertical: spacing.lg },
  avatarWrap: { width: 72, height: 72, marginBottom: spacing.sm },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.brandLight,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: { width: "100%", height: "100%" },
  avatarLetter: { fontSize: 28, fontWeight: "800", color: colors.brand },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  name: { fontSize: 18, fontWeight: "800", color: colors.text },
  meta: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  contact: { fontSize: 12, color: colors.textFaint, marginTop: 2 },
});
