import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { ProfileCard } from "@/components/ProfileCard";
import { SettingsRow } from "@/components/SettingsRow";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, spacing } from "@/theme";
import { pickProfilePhoto } from "@/utils/imagePicker";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

export function ProfileScreen({ navigation }: Props) {
  const { profile, business, updateProfile } = useAppState();
  const comingSoon = (label: string) => Alert.alert(label, "This is demonstrated on selected screens in this prototype.");

  const changePhoto = async () => {
    const uri = await pickProfilePhoto();
    if (uri) updateProfile({ photoUri: uri });
  };

  return (
    <View style={styles.root}>
      <Header title="Profile" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scrollBg} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <ProfileCard
          name={profile.fullName}
          subtitle={business.name}
          email={profile.email}
          phone={profile.phone}
          photoUri={profile.photoUri}
          onChangePhoto={changePhoto}
        />

        <Card padded={false} style={styles.card}>
          <SettingsRow icon="briefcase" label="Business Profile" onPress={() => navigation.navigate("BusinessSetup")} />
          <SettingsRow icon="user" label="User Management" onPress={() => comingSoon("User Management")} />
          <SettingsRow icon="bell" label="Notification Settings" onPress={() => navigation.navigate("Notifications")} />
          <SettingsRow icon="globe" label="Language" value="English" onPress={() => comingSoon("Language")} />
          <SettingsRow icon="grid" label="Theme" value="System" onPress={() => comingSoon("Theme")} isLast />
        </Card>

        <Button label="Edit Profile" onPress={() => navigation.navigate("ProfileEdit")} style={styles.editBtn} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  scrollBg: { flex: 1, backgroundColor: colors.bg },
  body: { paddingTop: spacing.md, paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  card: { marginTop: spacing.md },
  editBtn: { marginTop: spacing.lg },
});
