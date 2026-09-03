import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r lg:block">
        <AdminSidebar />
      </aside>
      <div className="lg:pl-[260px]">
        <AdminTopbar />
        <main className="mx-auto max-w-[1400px] space-y-6 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
