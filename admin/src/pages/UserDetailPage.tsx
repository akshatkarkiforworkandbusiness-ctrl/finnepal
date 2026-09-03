import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Building2, PlugZap, ArrowLeftRight, Clock, Mail, Phone, MapPin } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { UserAvatar } from "@/components/admin/UserAvatar";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { ConsentBadge } from "@/components/admin/ConsentBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { getUserById, getBusinessById, providerHealth, recentActivity, consents } from "@/lib/mock-data";

export default function UserDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const user = getUserById(id);
  const business = getBusinessById(user.businessId);
  const userConsents = consents.slice(0, 3);

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
        actions={<Button variant="outline">Message user</Button>}
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
              <p className="text-sm text-muted-foreground">Joined {user.joined}</p>
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
          <TabsTrigger value="businesses">Businesses</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="consent">Consent</TabsTrigger>
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

        <TabsContent value="businesses">
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
              {providerHealth.slice(0, user.providers).map((p) => (
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

        <TabsContent value="activity">
          <Card>
            <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
            <CardContent><ActivityFeed items={recentActivity.slice(0, 5)} /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consent">
          <Card>
            <CardContent className="divide-y p-0">
              {userConsents.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium">{c.provider}</p>
                    <p className="text-xs text-muted-foreground">{c.scope} · expires {c.expires}</p>
                  </div>
                  <ConsentBadge status={c.status} />
                </div>
              ))}
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
