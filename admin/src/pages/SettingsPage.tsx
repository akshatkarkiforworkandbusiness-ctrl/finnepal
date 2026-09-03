import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";

const toggles = [
  { id: "auto-sync", label: "Automatic provider sync", desc: "Continuously sync connected providers on a schedule.", on: true },
  { id: "risk-engine", label: "Risk detection engine", desc: "Flag anomalous transaction patterns in real time.", on: true },
  { id: "consent-expiry", label: "Consent expiry reminders", desc: "Notify businesses before data-sharing consent expires.", on: true },
  { id: "maintenance", label: "Maintenance mode", desc: "Pause sync operations for scheduled maintenance.", on: false },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="System Settings"
        subtitle="Configure platform-wide operational preferences."
        actions={<Button onClick={() => toast.success("Settings saved")}>Save changes</Button>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Sync configuration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="interval">Sync interval</Label>
              <Select defaultValue="5">
                <SelectTrigger id="interval"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Every 1 minute</SelectItem>
                  <SelectItem value="5">Every 5 minutes</SelectItem>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="60">Every hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="retries">Max sync retries</Label>
              <Input id="retries" type="number" defaultValue={3} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Operational toggles</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {toggles.map((t, i) => (
              <div key={t.id}>
                {i > 0 && <Separator className="my-1" />}
                <div className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <Label htmlFor={t.id} className="cursor-pointer">{t.label}</Label>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                  <Switch id={t.id} defaultChecked={t.on} onCheckedChange={() => toast(`${t.label} updated`)} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-red-200">
        <CardHeader><CardTitle className="text-[#C5161D]">Security notice</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Orbit's admin console operates on operational metadata only. Bank passwords, MPIN, OTP, CVV, and provider API
          secrets are never stored in, transmitted to, or displayed by this dashboard.
        </CardContent>
      </Card>
    </div>
  );
}
