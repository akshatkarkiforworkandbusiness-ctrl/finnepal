import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RootNavigator } from "@/navigation/RootNavigator";
import { AppProvider } from "@/state/AppContext";
import { AuthProvider } from "@/context/AuthContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <AppProvider>
            <StatusBar style="light" />
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </AppProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
