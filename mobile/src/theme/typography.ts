import { TextStyle } from "react-native";
import { colors } from "./colors";

export const typography: Record<string, TextStyle> = {
  display: { fontSize: 34, fontWeight: "800", color: colors.text, letterSpacing: -0.5 },
  h1: { fontSize: 24, fontWeight: "700", color: colors.text },
  h2: { fontSize: 20, fontWeight: "700", color: colors.text },
  h3: { fontSize: 17, fontWeight: "700", color: colors.text },
  label: { fontSize: 13, fontWeight: "600", color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.6 },
  body: { fontSize: 15, fontWeight: "400", color: colors.text, lineHeight: 21 },
  bodyMedium: { fontSize: 15, fontWeight: "600", color: colors.text },
  caption: { fontSize: 13, fontWeight: "400", color: colors.textMuted },
  captionMedium: { fontSize: 13, fontWeight: "600", color: colors.textMuted },
  tiny: { fontSize: 11, fontWeight: "500", color: colors.textFaint },
  numberLg: { fontSize: 32, fontWeight: "800", color: colors.text, letterSpacing: -0.5 },
  numberXl: { fontSize: 42, fontWeight: "800", color: colors.text, letterSpacing: -1 },
};
