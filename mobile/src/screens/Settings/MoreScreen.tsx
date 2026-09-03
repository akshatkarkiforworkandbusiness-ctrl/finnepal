import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { IconName } from "@/components/Icon";
import { SettingsRow } from "@/components/SettingsRow";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { useAuth } from "@/context/AuthContext";
import { colors, spacing, typography } from "@/theme";

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface MenuItem {
  icon: IconName;
  label: string;
  subtitle?: string;
  onPress: () => void;
}

export function MoreScreen() {
  const navigation = useNavigation<Nav>();
  const { logOut, profile } = useAppState();
  const { logout: logOutOfOrbit } = useAuth();
  const [logoutVisible, setLogoutVisible] = useState(false);

  const comingSoon = (label: string) => Alert.alert(label, "This is demonstrated on selected screens in this prototype.");

  const sections: { title: string; items: MenuItem[] }[] = [
    {
      title: "Business",
      items: [
        { icon: "link", label: "Bank & Wallet Connections", onPress: () => navigation.navigate("BankConnections") },
        { icon: "briefcase", label: "My Accountant", subtitle: "Sharma & Associates", onPress: () => comingSoon("My Accountant") },
        { icon: "layers", label: "Subscription", subtitle: "Premium Plan", onPress: () => comingSoon("Subscription") },
      ],
    },
    {
      title: "Security & Data",
      items: [
        { icon: "shield", label: "Security & Privacy", onPress: () => navigation.navigate("SecurityPrivacy") },
        { icon: "share-2", label: "Data Sharing", onPress: () => navigation.navigate("ShareConsent") },
        { icon: "clock", label: "Activity Log", onPress: () => navigation.navigate("ActivityLog") },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: "help-circle", label: "Help & Support", onPress: () => navigation.navigate("HelpCenter") },
        { icon: "info", label: "About Orbit", onPress: () => navigation.navigate("About") },
        { icon: "globe", label: "Language", onPress: () => comingSoon("Language") },
        { icon: "grid", label: "Theme", onPress: () => comingSoon("Theme") },
      ],
    },
    {
      title: "Prototype",
      items: [{ icon: "layers", label: "Demo States", onPress: () => navigation.navigate("DemoStates") }],
    },
  ];

  const confirmLogOut = async () => {
    await logOutOfOrbit();
    logOut();
    setLogoutVisible(false);
    (navigation.getParent() ?? navigation).reset({ index: 0, routes: [{ name: "Login" }] });
  };

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
      </View>
      <ScrollView style={styles.scrollBg} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")} activeOpacity={0.8}>
          <Card style={styles.profileRow}>
            <View style={styles.avatar}>
              {profile.photoUri ? (
                <Image source={{ uri: profile.photoUri }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarLetter}>{profile.fullName.charAt(0)}</Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>View Profile</Text>
              <Text style={styles.profileSub}>Business owner details</Text>
            </View>
          </Card>
        </TouchableOpacity>

        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={typography.label}>{section.title}</Text>
            <Card style={styles.sectionCard} padded={false}>
              {section.items.map((item, i) => (
                <SettingsRow
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  subtitle={item.subtitle}
                  onPress={item.onPress}
                  isLast={i === section.items.length - 1}
                />
              ))}
            </Card>
          </View>
        ))}

        <Button label="Logout" variant="danger" onPress={() => setLogoutVisible(true)} style={styles.logOut} />
      </ScrollView>

      <ConfirmDialog
        visible={logoutVisible}
        title="Log out of Orbit?"
        message="You'll need to sign back in to access your business data."
        confirmLabel="Log out"
        cancelLabel="Cancel"
        danger
        onConfirm={confirmLogOut}
        onCancel={() => setLogoutVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  header: { backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { color: colors.text, fontSize: 22, fontWeight: "800" },
  scrollBg: { flex: 1, backgroundColor: colors.bg },
  body: { paddingTop: spacing.md, paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  profileRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.brandLight, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  avatarImage: { width: "100%", height: "100%" },
  avatarLetter: { fontSize: 18, fontWeight: "800", color: colors.brand },
  profileName: { fontSize: 14, fontWeight: "700", color: colors.text },
  profileSub: { fontSize: 12, color: colors.textFaint, marginTop: 2 },
  section: { marginBottom: spacing.md },
  sectionCard: { marginTop: spacing.xs },
  logOut: { marginTop: spacing.sm },
});
