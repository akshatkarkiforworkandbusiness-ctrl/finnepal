import { api } from "./api";

interface UploadSignature {
  timestamp: number;
  folder: string;
  signature: string;
  api_key: string;
  cloud_name: string;
  upload_url: string;
}

/** Requests a signed slot from our backend, then uploads the file directly to
 * Cloudinary (the API secret never leaves the server). Returns the
 * Cloudinary secure_url to store on the record (e.g. admin.photo_url). */
export async function uploadToCloudinary(file: File, purpose = "avatar"): Promise<string> {
  const sig = await api.post<UploadSignature>(`/admin/uploads/signature?purpose=${encodeURIComponent(purpose)}`);

  const form = new FormData();
  form.append("file", file);
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
