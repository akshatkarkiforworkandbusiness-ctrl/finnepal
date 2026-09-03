import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Building2, PlugZap, ArrowLeftRight, Clock, Mail, Phone, MapPin } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { UserAvatar } from "@/components/admin/UserAvatar";
import { ConsentBadge } from "@/components/admin/ConsentBadge";
import { AuditTimeline } from "@/components/admin/AuditTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { getUserById } from "@/mock/users";
import { getBusinessById } from "@/mock/businesses";
import { paymentProviders } from "@/mock/payments";
import { consents } from "@/mock/consent";
import { securityEvents } from "@/mock/security";
import { auditEvents } from "@/mock/audit";

export default function UserDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const user = getUserById(id);
  const business = getBusinessById(user.businessId);
  const userConsents = consents.filter((c) => c.business === user.business).slice(0, 4);
  const userAudit = auditEvents.filter((e) => e.target === user.id);

  const stats = [
    { label: "Total businesses", value: "1", icon: Building2 },
    { label: "Connected providers", value: String(user.providers), icon: PlugZap },
    { label: "Transactions synced", value: user.transactions.toLocaleString(), icon: ArrowLeftRight },
    { label: "Last active", value: user.lastActive, icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={() => navigate("/admin/users")}>
        <ArrowLeft className="h-4 w-4" /> Back to users
      </Button>

      <AdminPageHeader
        title="User profile"
        actions={
          <>
            <StatusBadge status={user.kyc} className="h-7 px-3" />
            <Button variant="outline">Message user</Button>
          </>
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <UserAvatar name={user.name} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <StatusBadge status={user.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                {user.id} · Joined {user.joined}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-1">
            <span className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> {user.email}</span>
            <span className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {user.phone}</span>
            <span className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> {user.location}</span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="connections">Connected Sources</TabsTrigger>
          <TabsTrigger value="consent">Consent</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <Card key={s.label} className="p-4">
                <s.icon className="h-4 w-4 text-primary" />
                <p className="mt-3 text-2xl font-semibold tabular-nums">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="business">
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="font-medium">{business.name}</p>
                <p className="text-sm text-muted-foreground">{business.type} · {business.location}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/admin/businesses/${business.id}`}>View business</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections">
          <Card>
            <CardContent className="divide-y p-0">
              {paymentProviders.slice(0, user.providers).map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                  </div>
                  <StatusBadge status="Connected" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consent">
          <Card>
            <CardContent className="divide-y p-0">
              {userConsents.length === 0 && (
                <p className="p-5 text-sm text-muted-foreground">No consent records for this user.</p>
              )}
              {userConsents.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium">{c.provider} — {c.purpose}</p>
                    <p className="text-xs text-muted-foreground">{c.scope} · expires {c.expires}</p>
                  </div>
                  <ConsentBadge status={c.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader><CardTitle>Recent security events</CardTitle></CardHeader>
            <CardContent className="divide-y p-0">
              {securityEvents.slice(0, 4).map((e) => (
                <div key={e.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium">{e.type}</p>
                    <p className="text-xs text-muted-foreground">{e.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{e.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader><CardTitle>Audit history</CardTitle></CardHeader>
            <CardContent>
              <AuditTimeline events={userAudit.length > 0 ? userAudit : auditEvents.slice(0, 3)} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />
      <p className="text-xs text-muted-foreground">
        Orbit never stores or displays bank passwords, MPIN, OTP, CVV or API secrets. Only operational metadata is shown.
      </p>
    </div>
  );
}
