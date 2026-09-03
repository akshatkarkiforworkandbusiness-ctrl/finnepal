import { apiRequest } from "./client";

interface UploadSignature {
  timestamp: number;
  folder: string;
  signature: string;
  api_key: string;
  cloud_name: string;
  upload_url: string;
}

/** Uploads a local file (from expo-image-picker, a file:// URI) directly to
 * Cloudinary using a signature from our backend. The API secret never
 * reaches the device. Returns the Cloudinary secure_url. */
export async function uploadImage(localUri: string, purpose = "avatar"): Promise<string> {
  const sig = await apiRequest<UploadSignature>(`/uploads/signature?purpose=${encodeURIComponent(purpose)}`, {
    method: "POST",
    auth: true,
  });

  const filename = localUri.split("/").pop() ?? "upload.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const ext = match ? match[1].toLowerCase() : "jpg";
  const mimeType = ext === "png" ? "image/png" : "image/jpeg";

  const form = new FormData();
  // React Native's fetch accepts this {uri, name, type} shape for file fields.
  form.append("file", { uri: localUri, name: filename, type: mimeType } as unknown as Blob);
  form.append("api_key", sig.api_key);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);

  const res = await fetch(sig.upload_url, { method: "POST", body: form });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error?.message ?? "Upload failed");
  }
  const data = await res.json();
  return data.secure_url as string;
}
