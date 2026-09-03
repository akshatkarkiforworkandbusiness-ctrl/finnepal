import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { updateMe } from "@/api/users";
import { uploadImage } from "@/api/uploads";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { ScreenContainer } from "@/components/ScreenContainer";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { useAuth } from "@/context/AuthContext";
import { colors, radius, spacing, typography } from "@/theme";
import { pickProfilePhoto } from "@/utils/imagePicker";

type Props = NativeStackScreenProps<RootStackParamList, "ProfileEdit">;

function Field({
  label,
  value,
  onChangeText,
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText?: (v: string) => void;
  editable?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={typography.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        style={[styles.input, !editable && styles.inputDisabled]}
        placeholderTextColor={colors.textFaint}
      />
    </View>
  );
}

export function ProfileEditScreen({ navigation }: Props) {
  const { profile, updateProfile } = useAppState();
  const { refresh: refreshAuth } = useAuth();
  const [name, setName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);
  const [photoUri, setPhotoUri] = useState(profile.photoUri);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const changePhoto = async () => {
    const uri = await pickProfilePhoto();
    if (!uri) return;
    setPhotoUri(uri);
    setIsUploadingPhoto(true);
    try {
      const secureUrl = await uploadImage(uri, "avatar");
      await updateMe({ photo_url: secureUrl });
      setPhotoUri(secureUrl);
      updateProfile({ photoUri: secureUrl });
      await refreshAuth();
    } catch {
      // Keep the locally-picked image showing; the next save/reopen will
      // reflect whatever the server actually has.
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const save = async () => {
    setIsSaving(true);
    try {
      await updateMe({ name, phone, location });
      updateProfile({ fullName: name, phone, location, photoUri });
      await refreshAuth();
      navigation.goBack();
    } catch {
      // Keep the user on the screen with their edits so they can retry.
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <Header title="Edit Profile" onBack={() => navigation.goBack()} />
      <ScreenContainer edges={[]} contentStyle={styles.content}>
        <TouchableOpacity onPress={changePhoto} activeOpacity={0.8} style={styles.photoWrap} accessibilityRole="button" accessibilityLabel="Change profile photo">
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarLetter}>{name.charAt(0)}</Text>
              )}
              {isUploadingPhoto && (
                <View style={styles.avatarOverlay}>
                  <ActivityIndicator color={colors.white} />
                </View>
              )}
            </View>
            <View style={styles.cameraBadge}>
              <Icon name="camera" size={13} color={colors.white} />
            </View>
          </View>
          <Text style={styles.photoLabel}>Change photo</Text>
        </TouchableOpacity>

        <Field label="Full name" value={name} onChangeText={setName} />
        <Field label="Phone" value={phone} onChangeText={setPhone} />
        <Field label="Email" value={profile.email ?? ""} editable={false} />
        <Field label="Location" value={location} onChangeText={setLocation} />

        <Button label="Save changes" onPress={save} loading={isSaving} style={styles.save} />
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  photoWrap: { alignItems: "center", marginBottom: spacing.lg },
  avatarWrap: { width: 84, height: 84 },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.brandLight,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: { width: "100%", height: "100%" },
  avatarLetter: { fontSize: 32, fontWeight: "800", color: colors.brand },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.bg,
  },
  photoLabel: { fontSize: 13, fontWeight: "700", color: colors.brand, marginTop: spacing.sm },
  field: { marginBottom: spacing.md },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    marginTop: spacing.xs,
  },
  inputDisabled: { backgroundColor: colors.brandLight, color: colors.textMuted },
  save: { marginTop: spacing.md },
});
