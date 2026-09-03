import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AuditEventRow } from "@/components/admin/AuditEventRow";
import { SearchInput } from "@/components/admin/SearchInput";
import { FilterBar } from "@/components/admin/FilterBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { auditEvents } from "@/lib/mock-data";
import { toast } from "@/components/ui/sonner";

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const filtered = auditEvents.filter(
    (e) =>
      (category === "all" || e.category.toLowerCase() === category) &&
      (e.action.toLowerCase().includes(search.toLowerCase()) || e.actor.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Audit Logs"
        subtitle="Immutable record of admin and system actions."
        actions={
          <Button variant="outline" className="gap-2" onClick={() => toast("Export started", { description: "Audit log export queued." })}>
            <Download className="h-4 w-4" /> Export
          </Button>
        }
      />
      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search actions or actors" className="sm:w-72" />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="sm:w-44"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="access">Access</SelectItem>
            <SelectItem value="config">Config</SelectItem>
            <SelectItem value="data">Data</SelectItem>
            <SelectItem value="security">Security</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>
      <Card>
        <CardContent className="divide-y p-4">
          {filtered.map((e) => (
            <AuditEventRow key={e.id} event={e} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
