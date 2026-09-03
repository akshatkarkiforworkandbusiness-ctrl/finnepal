export const colors = {
  brand: "#0B3D2E",
  brandDark: "#071F17",
  brandLight: "#E8F0EB",
  brandSoft: "#D9E8DF",
  red: "#C5161D",
  redSoft: "#FBE7E8",
  white: "#FFFFFF",
  bg: "#F5F3EF",
  surface: "#FFFFFF",
  border: "rgba(11, 61, 46, 0.1)",
  borderStrong: "rgba(11, 61, 46, 0.18)",
  text: "#1A1A1A",
  textMuted: "#6B7280",
  textFaint: "#9CA3AF",
  success: "#16A34A",
  successSoft: "#F0FDF4",
  warning: "#D97706",
  warningSoft: "#FFFBEB",
  info: "#2563EB",
  infoSoft: "#EFF6FF",
} as const;

export type ColorToken = keyof typeof colors;
