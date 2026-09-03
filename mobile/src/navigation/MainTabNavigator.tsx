import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import { FinancialProfileScreen } from "@/screens/FinancialProfile/FinancialProfileScreen";
import { HomeScreen } from "@/screens/Home/HomeScreen";
import { InsightsScreen } from "@/screens/Insights/InsightsScreen";
import { TransactionsScreen } from "@/screens/Money/TransactionsScreen";
import { MoreScreen } from "@/screens/Settings/MoreScreen";

import { CustomTabBar } from "./CustomTabBar";
import { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="FinancialProfile" component={FinancialProfileScreen} options={{ tabBarLabel: "Profile" }} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}
