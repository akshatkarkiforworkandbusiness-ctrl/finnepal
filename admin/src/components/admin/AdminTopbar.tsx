import { useState } from "react";
import { Menu, Bell, Search, AlertTriangle, UserCheck, RefreshCcw, XCircle, ShieldAlert, Settings2 } from "lucide-react";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";
import { AdminSidebar } from "./AdminSidebar";
import { EnvironmentBadge } from "./EnvironmentBadge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/admin/CommandPalette";
import { notifications } from "@/mock/notifications";
import { toast } from "@/components/ui/sonner";

const notifIcon = { sync: RefreshCcw, kyc: UserCheck, risk: AlertTriangle, transaction: XCircle, security: ShieldAlert, system: Settings2 };

export function AdminTopbar() {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur lg:px-6">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] p-0">
          <AdminSidebar />
        </SheetContent>
      </Sheet>

      <AdminBreadcrumbs />

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden gap-2 text-muted-foreground sm:flex" onClick={() => setCmdOpen(true)}>
          <Search className="h-4 w-4" />
          <span>Search users, businesses, transactions...</span>
        </Button>
        <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Search" onClick={() => setCmdOpen(true)}>
          <Search className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {notifications.filter((n) => n.status === "Unread").length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C5161D] px-1 text-[10px] font-semibold text-white">
                  {notifications.filter((n) => n.status === "Unread").length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <span className="text-xs font-normal text-muted-foreground">
                {notifications.filter((n) => n.status === "Unread").length} new
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.slice(0, 6).map((n) => {
              const Icon = notifIcon[n.type];
              return (
                <DropdownMenuItem key={n.id} className="items-start gap-3 py-2.5">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{n.description}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/70">{n.time}</p>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <EnvironmentBadge className="hidden sm:inline-flex" />

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Admin avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-muted">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">OA</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium sm:inline">Orbit Admin</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">Orbit Admin</p>
              <p className="text-xs font-normal text-muted-foreground">Operations</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast("Profile")}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Settings")}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[#C5161D] focus:text-[#C5161D]" onClick={() => toast("Signed out")}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
        <CommandInput placeholder="Search users, businesses, transactions..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick actions">
            <CommandItem onSelect={() => { setCmdOpen(false); toast("Export started"); }}>Export platform report</CommandItem>
            <CommandItem onSelect={() => { setCmdOpen(false); toast("Sync triggered"); }}>Trigger provider sync</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}
