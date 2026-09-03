import React from "react";
import { Switch } from "react-native";

import { colors } from "@/theme";

interface Props {
  value: boolean;
  onValueChange: (v: boolean) => void;
  accessibilityLabel?: string;
}

export function Toggle({ value, onValueChange, accessibilityLabel }: Props) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#E5E7EB", true: colors.brand }}
      thumbColor={colors.white}
      ios_backgroundColor="#E5E7EB"
      accessibilityLabel={accessibilityLabel}
    />
  );
}
