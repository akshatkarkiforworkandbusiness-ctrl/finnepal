import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

/** Launches the device photo library and returns a local file URI, or null if cancelled/denied. */
export async function pickProfilePhoto(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert("Photo access needed", "Allow photo library access to set a profile picture.");
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled || result.assets.length === 0) return null;
  return result.assets[0].uri;
}
