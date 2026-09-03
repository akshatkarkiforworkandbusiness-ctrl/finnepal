import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { PROVIDER_LOGOS } from "@/data/logos";
import { Provider } from "@/types";

interface Props {
  provider: Provider;
  size?: number;
}

export function ProviderBadge({ provider, size = 40 }: Props) {
  const logo = PROVIDER_LOGOS[provider.id];

  if (logo) {
    return (
      <View
        style={[
          styles.logoWrap,
          { width: size, height: size, borderRadius: size * 0.3 },
        ]}
      >
        <Image source={logo} style={styles.logoImage} resizeMode="contain" />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.badge,
        { width: size, height: size, borderRadius: size * 0.3, backgroundColor: provider.color },
      ]}
    >
      <Text style={[styles.letter, { fontSize: size * 0.4 }]}>{provider.shortName.charAt(0)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignItems: "center", justifyContent: "center" },
  letter: { color: "#fff", fontWeight: "800" },
  logoWrap: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(11,61,46,0.08)",
    overflow: "hidden",
    padding: 2,
  },
  logoImage: { width: "100%", height: "100%", borderRadius: 4 },
});
