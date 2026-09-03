import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import { uploadToCloudinary } from "@/lib/upload";
import type { AdminMe } from "@/types/api";

const roleLabel: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  OPERATIONS_ADMIN: "Operations Admin",
  SUPPORT_ADMIN: "Support Admin",
  COMPLIANCE_ADMIN: "Compliance Admin",
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "AD";
}

export default function AdminProfilePage() {
  const { admin, refresh } = useAuth();
  const [name, setName] = useState(admin?.name ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!admin) return null;

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setIsUploading(true);
    try {
      const photoUrl = await uploadToCloudinary(file, "avatar");
      await api.patch<AdminMe>("/admin/me", { photo_url: photoUrl });
      await refresh();
      toast.success("Profile photo updated");
    } catch (err) {
      toast.error("Upload failed", { description: err instanceof Error ? err.message : "Try again." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.patch<AdminMe>("/admin/me", { name });
      await refresh();
      toast.success("Profile updated");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not save changes.";
      toast.error("Update failed", { description: message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <AdminPageHeader title="Profile" subtitle="Manage your Orbit admin account." />

      <Card className="p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={admin.photo_url ?? undefined} alt={admin.name} />
              <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
                {initials(admin.name)}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={handlePhotoClick}
              disabled={isUploading}
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground disabled:opacity-60"
              aria-label="Change profile photo"
            >
              {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{admin.email}</p>
            <p className="text-xs text-muted-foreground">{roleLabel[admin.role] ?? admin.role}</p>
          </div>
        </div>

        <div className="mt-6 space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <Button className="mt-6" onClick={handleSave} disabled={isSaving || !name.trim()}>
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
        </Button>
      </Card>
    </div>
  );
}
