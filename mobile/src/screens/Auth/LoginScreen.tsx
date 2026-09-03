import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";

import { login, register, resendOtp, verifyOtp } from "@/api/auth";
import { ApiError } from "@/api/client";
import { getMe } from "@/api/users";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { FormField } from "@/components/FormField";
import { RootStackParamList } from "@/navigation/types";
import { useAuth } from "@/context/AuthContext";
import { useAppState } from "@/state/AppContext";
import { colors, spacing, typography } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { setCustomer } = useAuth();
  const { businessSetupComplete, accountsConnected, updateProfile } = useAppState();

  const [step, setStep] = useState<"email" | "register" | "otp">("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const proceedAfterAuth = () => {
    navigation.replace(businessSetupComplete && accountsConnected ? "MainTabs" : "Welcome");
  };

  const handleContinue = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await login(email);
      if (res.requires_registration) {
        setStep("register");
      } else {
        setStep("otp");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach Orbit.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await register(email, name || email.split("@")[0]);
      setStep("otp");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach Orbit.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await verifyOtp(email, code);
      const me = await getMe();
      setCustomer(me);
      updateProfile({
        fullName: me.name,
        email: me.email,
        phone: me.phone ?? "",
        photoUri: me.photo_url ?? undefined,
        location: me.location ?? "",
      });
      proceedAfterAuth();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid or expired code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.centerFill}>
        <Image source={require("../../../assets/logos/mark.png")} style={styles.logo} resizeMode="contain" />
        <Text style={styles.wordmark}>ORBIT</Text>

        <Card style={styles.card}>
          {step === "email" && (
            <>
              <Text style={[typography.h3, styles.title]}>Log in or sign up</Text>
              <FormField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <Button label="Continue" onPress={handleContinue} loading={isLoading} disabled={!email.includes("@")} />
            </>
          )}

          {step === "register" && (
            <>
              <Text style={[typography.h3, styles.title]}>Create your account</Text>
              <FormField label="Full name" value={name} onChangeText={setName} />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <Button label="Send code" onPress={handleRegister} loading={isLoading} disabled={!name.trim()} />
            </>
          )}

          {step === "otp" && (
            <>
              <Text style={[typography.h3, styles.title]}>Enter the code</Text>
              <Text style={styles.subtitle}>Sent to {email}</Text>
              <FormField label="6-digit code" value={code} onChangeText={setCode} keyboardType="number-pad" />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <Button label="Verify & continue" onPress={handleVerify} loading={isLoading} disabled={code.length < 4} />
              <Text style={styles.resendLink} onPress={() => resendOtp(email)}>
                Resend code
              </Text>
            </>
          )}
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.brand },
  centerFill: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg },
  logo: { width: 64, height: 64, marginBottom: spacing.sm },
  wordmark: { color: colors.white, fontSize: 22, fontWeight: "800", letterSpacing: 3, marginBottom: spacing.xl },
  card: { width: "100%" },
  title: { marginBottom: spacing.sm },
  subtitle: { color: colors.textMuted, fontSize: 13, marginBottom: spacing.sm, marginTop: -spacing.xs },
  errorText: { color: colors.red, fontSize: 12, fontWeight: "600", marginBottom: spacing.sm },
  resendLink: { color: colors.brand, fontWeight: "700", fontSize: 13, textAlign: "center", marginTop: spacing.sm },
});
